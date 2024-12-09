"use client";

import React from "react";
import dynamic from 'next/dynamic';
import './styles.css';

interface SnackbarProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

const SnackbarContent = ({ message, type, visible }: SnackbarProps) => {
  return (
    <div className={`snackbar ${type} ${visible ? "show" : "hide"}`}>
      {message}
    </div>
  );
};

// Disable SSR for the Portal wrapper
const SnackbarPortal = dynamic(
  () => import('./SnackbarPortal'),
  { ssr: false }
);

export default function Snackbar(props: SnackbarProps) {
  return (
    <SnackbarPortal>
      <SnackbarContent {...props} />
    </SnackbarPortal>
  );
}
