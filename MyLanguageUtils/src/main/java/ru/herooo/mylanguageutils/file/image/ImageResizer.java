package ru.herooo.mylanguageutils.file.image;

import org.imgscalr.Scalr;
import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.StringUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageResizer {
    private final StringUtils STRING_UTILS = new StringUtils();
    private final FileUtils FILE_UTILS = new FileUtils();

    public BufferedImage resize(BufferedImage bufferedImage, int size) {
        return Scalr.resize(bufferedImage, size);
    }

    public File resize(File image, int size) throws IOException {
        File newImage = null;

        if (image != null && image.exists()) {
            String extension = FILE_UTILS.getExtension(image.getName());
            if (!STRING_UTILS.isStringVoid(extension)) {
                BufferedImage bi = ImageIO.read(image);
                bi = resize(bi, size);

                String newFileName = String.format("%s%s_%s", "r", extension, image.getName());
                String newFilePath = FILE_UTILS.getPathWithoutFileName(image.getPath());
                newFilePath = String.format("%s/%s", newFilePath, newFileName);

                newImage = new File(newFilePath);
                ImageIO.write(bi, extension, newImage);

                if (newImage.exists()) {
                    // Удаляем предыдущий файл
                    image.delete();
                }
            }
        }

        return newImage;
    }
}
