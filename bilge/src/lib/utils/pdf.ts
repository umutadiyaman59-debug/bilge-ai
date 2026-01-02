import type { Message } from '$lib/stores/chat';

/**
 * Export chat messages to PDF
 */
export async function exportToPdf(
	messages: Message[],
	title: string = 'Bilge Sohbet Geçmişi'
): Promise<void> {
	// Dynamic import to reduce initial bundle size
	const { jsPDF } = await import('jspdf');

	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4'
	});

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;
	let yPosition = margin;

	// Header
	doc.setFontSize(24);
	doc.setTextColor(26, 54, 93); // Primary color
	doc.text('Bilge', margin, yPosition);

	yPosition += 8;
	doc.setFontSize(12);
	doc.setTextColor(100);
	doc.text(title, margin, yPosition);

	yPosition += 5;
	doc.setFontSize(10);
	doc.text(new Date().toLocaleString('tr-TR'), margin, yPosition);

	yPosition += 15;

	// Separator line
	doc.setDrawColor(212, 168, 83); // Accent color
	doc.setLineWidth(0.5);
	doc.line(margin, yPosition, pageWidth - margin, yPosition);

	yPosition += 10;

	// Messages
	doc.setFontSize(11);

	for (const message of messages) {
		const isUser = message.role === 'user';
		const roleLabel = isUser ? 'Siz' : 'Bilge';
		const timestamp = new Date(message.timestamp).toLocaleTimeString('tr-TR', {
			hour: '2-digit',
			minute: '2-digit'
		});

		// Check if we need a new page
		if (yPosition > pageHeight - margin * 2) {
			doc.addPage();
			yPosition = margin;
		}

		// Role and timestamp
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(isUser ? 26 : 212, isUser ? 54 : 168, isUser ? 93 : 83);
		doc.text(`${roleLabel} • ${timestamp}`, margin, yPosition);

		yPosition += 6;

		// Message content
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(50);

		// Split long text into lines
		const lines = doc.splitTextToSize(message.content, contentWidth);

		for (const line of lines) {
			if (yPosition > pageHeight - margin) {
				doc.addPage();
				yPosition = margin;
			}
			doc.text(line, margin, yPosition);
			yPosition += 5;
		}

		yPosition += 8;
	}

	// Footer on last page
	doc.setFontSize(9);
	doc.setTextColor(150);
	doc.text(
		"Bilge - Türkiye'nin İlk Yerli Yapay Zekası",
		pageWidth / 2,
		pageHeight - 10,
		{ align: 'center' }
	);

	// Save the PDF
	const fileName = `bilge-sohbet-${new Date().toISOString().slice(0, 10)}.pdf`;
	doc.save(fileName);
}

/**
 * Export chat to plain text
 */
export function exportToText(messages: Message[], title: string = 'Bilge Sohbet Geçmişi'): string {
	let text = `${title}\n`;
	text += `Oluşturulma: ${new Date().toLocaleString('tr-TR')}\n`;
	text += '─'.repeat(50) + '\n\n';

	for (const message of messages) {
		const roleLabel = message.role === 'user' ? 'Siz' : 'Bilge';
		const timestamp = new Date(message.timestamp).toLocaleTimeString('tr-TR', {
			hour: '2-digit',
			minute: '2-digit'
		});

		text += `[${roleLabel}] ${timestamp}\n`;
		text += `${message.content}\n\n`;
	}

	text += '─'.repeat(50) + '\n';
	text += "Bilge - Türkiye'nin İlk Yerli Yapay Zekası\n";

	return text;
}

/**
 * Download text as file
 */
export function downloadTextFile(content: string, filename: string): void {
	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
