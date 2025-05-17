import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import styles from './styles.module.css';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	maxWidth?: string;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = '600px',
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const modalStyle = {
		maxWidth,
		top: 'auto'
	};

	return createPortal(
		<div className={styles.modalOverlay} onClick={onClose}>
			<div
				ref={modalRef}
				className={styles.modalContent}
				style={modalStyle}
				onClick={e => e.stopPropagation()}
			>
				<div className={styles.modalHeader}>
					{title && <h2>{title}</h2>}
					<button
						className={styles.closeButton}
						onClick={onClose}
						aria-label="Close modal"
					>
						<FaTimes />
					</button>
				</div>
				{children}
			</div>
		</div>,
		document.body
	);
} 