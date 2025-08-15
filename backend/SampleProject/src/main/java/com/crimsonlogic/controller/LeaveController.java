package com.crimsonlogic.controller;

import com.crimsonlogic.dto.LeaveApplicationDTO;
import com.crimsonlogic.model.LeaveApplication;
import com.crimsonlogic.repository.LeaveApplicationRepository;
import com.crimsonlogic.service.LeaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    private final LeaveService leaveService;
    private final LeaveApplicationRepository repository;

    public LeaveController(LeaveService leaveService, LeaveApplicationRepository repository) {
        this.leaveService = leaveService;
        this.repository = repository;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(
            @RequestParam("employeeId") String employeeId,
            @RequestParam("leaveDates") String leaveDates,
            @RequestParam("reason") String reason,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            LeaveApplicationDTO application = leaveService.applyMedicalLeave(employeeId, leaveDates, reason, file);
            return ResponseEntity.ok(Map.of(
                    "applicationId", application.getApplicationId(),
                    "status", application.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to apply leave"));
        }
    }

    @GetMapping("/all")
    public List<LeaveApplicationDTO> getAllApplications() {
        return repository.findAll().stream().map(leaveService::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/pending")
    public List<LeaveApplicationDTO> getPendingApplications() {
        return repository.findByStatus("PENDING").stream().map(application -> {
            LeaveApplicationDTO dto = new LeaveApplicationDTO();
            dto.setApplicationId(application.getId());
            dto.setEmployeeId(application.getEmployeeId());
            dto.setLeaveDates(application.getLeaveDates());
            dto.setReason(application.getReason());
            dto.setFileName(application.getFileName());
            dto.setStatus(application.getStatus());
            // Add extracted MC fields if available
            dto.setPatientName(application.getPatientName());
            dto.setDoctorName(application.getDoctorName());
            dto.setClinicName(application.getClinicName());
            dto.setClinicAddress(application.getClinicAddress());
            dto.setContactNumber(application.getContactNumber());
            dto.setRegistrationId(application.getRegistrationId());
            dto.setDateOfIssue(application.getDateOfIssue());
            dto.setMcNumber(application.getMcNumber());
            dto.setQrCodePresent(application.getQrCodePresent());
            return dto;
        }).collect(Collectors.toList());
    }

    @PostMapping("/extract-fields/{id}")
    public LeaveApplicationDTO extractFields(@PathVariable Long id) {
        return leaveService.extractAndUpdateMcFields(id);
    }

    @PostMapping("/verify/{id}")
    public LeaveApplicationDTO verifyLeave(
            @PathVariable Long id,
            @RequestParam("status") String status // APPROVED or REJECTED
    ) {
        LeaveApplication app = repository.findById(id).orElseThrow();
        app.setStatus(status);
        repository.save(app);
        return leaveService.toDTO(app);
    }
}