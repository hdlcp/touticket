// utils/compressImage.js
export function compressImage(file, maxWidthPx = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Redimensionne si trop large
        if (width > maxWidthPx) {
          height = Math.round((height * maxWidthPx) / width);
          width = maxWidthPx;
        }

        canvas.width  = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
          "image/jpeg",
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file, maxSizeMB = 5) {
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Le fichier doit être une image (JPG, PNG...)" };
  }

  if (file.size > maxBytes) {
    return { valid: false, error: `L'image ne doit pas dépasser ${maxSizeMB} MB` };
  }

  return { valid: true };
}