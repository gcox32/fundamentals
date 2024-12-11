"use client";

import React from "react";
import Link from "next/link";
import './styles.css';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Fundamental</p>
      </div>
    </footer>
  );
}
