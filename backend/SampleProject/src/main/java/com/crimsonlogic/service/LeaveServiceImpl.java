package com.crimsonlogic.service;

import com.crimsonlogic.dto.LeaveApplicationDTO;
import com.crimsonlogic.model.LeaveApplication;
import com.crimsonlogic.repository.LeaveApplicationRepository;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;
import net.sourceforge.tess4j.Tesseract;

import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveApplicationRepository repository;

    @Value("${upload.dir}")
    private String uploadDir;

    public LeaveServiceImpl(LeaveApplicationRepository repository) {
        this.repository = repository;
    }

    @Override
    public LeaveApplicationDTO applyMedicalLeave(String employeeId, String leaveDates, String reason, MultipartFile file) {
        // Extract text from the uploaded file immediately
        String extractedText = extractText(file);
        String fileName = saveFile(file);

        LeaveApplication application = new LeaveApplication();
        application.setEmployeeId(employeeId);
        application.setLeaveDates(leaveDates);
        application.setReason(reason);
        application.setFileName(fileName);
        application.setStatus("PENDING");

        extractAndSetMcFields(application, extractedText);

        repository.save(application);

        return toDTO(application);
    }

    @Override
    public LeaveApplicationDTO updateLeaveApplication(Long id, String leaveDates, String reason, MultipartFile file) {
        LeaveApplication application = repository.findById(id).orElseThrow();
        application.setLeaveDates(leaveDates);
        application.setReason(reason);
        if (file != null && !file.isEmpty()) {
            String fileName = saveFile(file);
            application.setFileName(fileName);
        }
        repository.save(application);
        return toDTO(application);
    }

    @Override
    public LeaveApplicationDTO extractAndUpdateMcFields(Long applicationId) {
        LeaveApplication application = repository.findById(applicationId).orElseThrow();
        // Always use the file from your permanent upload directory
        Path filePath = Paths.get(uploadDir, application.getFileName());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found: " + filePath);
        }
        try (InputStream input = Files.newInputStream(filePath)) {
            String extractedText = extractText(input);
            extractAndSetMcFields(application, extractedText);
            repository.save(application);
            return toDTO(application);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract MC fields", e);
        }
    }

    private String saveFile(MultipartFile file) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save file", e);
        }
    }

    private String extractText(MultipartFile file) {
        try (InputStream input = file.getInputStream()) {
            String contentType = file.getContentType();
            if (contentType != null && (contentType.startsWith("image/"))) {
                // Use OCR for image files
                return ocrImage(input);
            } else {
                // Use existing logic for PDFs
                return extractText(input);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private String extractText(InputStream input) {
        try {
            AutoDetectParser parser = new AutoDetectParser();
            ContentHandler handler = new BodyContentHandler(-1);
            Metadata metadata = new Metadata();
            parser.parse(input, handler, metadata);
            String text = handler.toString();
            if (text.trim().isEmpty()) {
                // Reset the stream for OCR
                if (input.markSupported()) {
                    input.reset();
                } else {
                    // If mark/reset not supported, re-open the stream from file
                    // You may need to pass the file path instead of InputStream for OCR fallback
                    return ""; // Or handle accordingly
                }
                text = ocrPdf(input);
            }
            return text;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private void extractAndSetMcFields(LeaveApplication application, String text) {
        System.out.println("=== Extracted MC Text ===");
        System.out.println(text);
        application.setPatientName(extractField(text, "Patient"));
        application.setClinicAddress(extractField(text, "Address"));
        application.setContactNumber(extractField(text, "Phone"));
        application.setRegistrationId(extractField(text, "Patient ID"));
        application.setDateOfIssue(extractField(text, "Date"));
        application.setMcNumber(extractField(text, "Email"));
    // Extract clinic name: first line ending with 'Clinic'
    String clinicName = null;
    for (String line : text.split("\\r?\\n")) {
        if (line.trim().endsWith("Clinic")) {
            clinicName = line.trim();
            break;
        }
    }
    application.setClinicName(clinicName);

    // Extract doctor name: first line starting with 'Dr.' or containing 'Physician' or 'Examiner'
    String doctorName = null;
    for (String line : text.split("\\r?\\n")) {
        if (line.trim().startsWith("Dr.")) {
            doctorName = line.trim();
            break;
        }
        if (line.contains("Physician") || line.contains("Examiner")) {
            // Try to get the name before the title
            int idx = line.indexOf("Physician");
            if (idx == -1) idx = line.indexOf("Examiner");
            if (idx > 0) {
                doctorName = line.substring(0, idx).trim();
                break;
            }
        }
    }
    application.setDoctorName(doctorName);

    // QR code detection (simple)
    application.setQrCodePresent(text.toLowerCase().contains("qr"));
    }

    private String extractField(String text, String label) {
        // Match label with any whitespace between words, then any whitespace before colon, then value
        String regex = label.replace(" ", "\\s*") + "\\s*:\\s*([^\\n]+)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private String ocrPdf(InputStream pdfInputStream) {
        try (PDDocument document = PDDocument.load(pdfInputStream)) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("C:/Tesseract-OCR/tessdata"); // Set path to tessdata
            StringBuilder sb = new StringBuilder();
            for (int page = 0; page < document.getNumberOfPages(); ++page) {
                BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300);
                String result = tesseract.doOCR(bim);
                sb.append(result).append("\n");
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private String ocrImage(InputStream imageInputStream) {
        try {
            BufferedImage image = javax.imageio.ImageIO.read(imageInputStream);
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("C:/Tesseract-OCR/tessdata"); // Set your tessdata path
            return tesseract.doOCR(image);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public LeaveApplicationDTO toDTO(LeaveApplication app) {
        LeaveApplicationDTO dto = new LeaveApplicationDTO();
        dto.setApplicationId(app.getId());
        dto.setEmployeeId(app.getEmployeeId());
        dto.setLeaveDates(app.getLeaveDates());
        dto.setReason(app.getReason());
        dto.setFileName(app.getFileName());
        dto.setStatus(app.getStatus());
        dto.setPatientName(app.getPatientName());
        dto.setDoctorName(app.getDoctorName());
        dto.setClinicName(app.getClinicName());
        dto.setClinicAddress(app.getClinicAddress());
        dto.setContactNumber(app.getContactNumber());
        dto.setRegistrationId(app.getRegistrationId());
        dto.setDateOfIssue(app.getDateOfIssue());
        dto.setMcNumber(app.getMcNumber());
        dto.setQrCodePresent(app.getQrCodePresent());
        return dto;
    }
}