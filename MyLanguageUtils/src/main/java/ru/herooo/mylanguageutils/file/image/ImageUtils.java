package ru.herooo.mylanguageutils.file.image;

import ru.herooo.mylanguageutils.StringUtils;

import javax.imageio.ImageIO;

public class ImageUtils {
    private final StringUtils STRING_UTILS = new StringUtils();

    public boolean isExtensionSupportedForRead(String extension) {
        boolean isSupported = false;

        if (!STRING_UTILS.isStringVoid(extension)) {
            isSupported = ImageIO.getImageReadersByFormatName(extension).hasNext();
        }

        return isSupported;
    }

    public boolean isExtensionSupportedForWrite(String extension) {
        boolean isSupported = false;

        if (!STRING_UTILS.isStringVoid(extension)) {
            isSupported = ImageIO.getImageWritersByFormatName(extension).hasNext();
        }

        return isSupported;
    }
}
