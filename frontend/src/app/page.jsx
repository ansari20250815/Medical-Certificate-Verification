'use client'
import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './home.module.css';

const carouselImages = [
  '/images/backgrounds/BIPO_image7.png',
  '/images/backgrounds/BIPO_image6.png',
  '/images/backgrounds/login-bg.svg'
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#f5f8fc', minHeight: '100vh', fontFamily: 'Inter, Arial, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 4vw', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image src="/images/logos/logoIcon.svg" alt="BipoMedix Logo" width={40} height={40} />
          <span style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: '1px', color: '#111' }}>BipoMedix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: 1, justifyContent: 'flex-start', marginLeft: '3rem' }}>
          <a href="#stories" className={styles.navLinkNav}>HOME</a>
          <a href="#pricing" className={styles.navLinkNav}>ABOUT US</a>
          <a href="#resources" className={styles.navLinkNav}>CONTACT US</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/login" className={styles.getStartedBtnNav}>LOGIN</Link>
        </div>
      </nav>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 4vw 0 4vw', display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.1rem', color: '#888', marginBottom: '2rem' }}>
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: '#111', lineHeight: 1.1, marginBottom: '2rem' }}>
            Transform Leave Management<br />with BipoMedix
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#222', marginBottom: '2.5rem' }}>
            BipoMedix empowers organizations to efficiently manage medical leave with a secure, intuitive, and fully digital platform.<br />
            Simplify application, approval, and compliance—while giving HR and managers real-time visibility and control.<br />
            <span style={{ color: '#1976d2', fontWeight: 600 }}>Experience seamless, paperless leave management for your modern workforce.</span>
          </p>
        </div>
        <div style={{ minWidth: '420px', maxWidth: '520px', width: '35vw', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <Image
            src={carouselImages[currentIndex]}
            alt={`Carousel ${currentIndex + 1}`}
            width={500}
            height={400}
            style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', objectFit: 'cover', transition: 'opacity 0.7s' }}
          />
        </div>
      </div>
    </div>
  )
}
