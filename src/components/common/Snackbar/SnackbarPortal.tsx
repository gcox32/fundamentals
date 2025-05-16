"use client";

import { createPortal } from 'react-dom';

export default function SnackbarPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
} 