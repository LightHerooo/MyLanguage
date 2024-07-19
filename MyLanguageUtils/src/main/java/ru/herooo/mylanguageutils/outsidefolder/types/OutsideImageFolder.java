package ru.herooo.mylanguageutils.outsidefolder.types;

import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.file.image.GifResizer;
import ru.herooo.mylanguageutils.file.image.ImageResizer;
import ru.herooo.mylanguageutils.file.image.ImageUtils;

import java.io.*;

public class OutsideImageFolder extends OutsideFolder {
    private final ImageUtils IMAGE_UTILS = new ImageUtils();
    private final FileUtils FILE_UTILS = new FileUtils();
    private final ImageResizer IMAGE_RESIZER = new ImageResizer();
    private final GifResizer GIF_RESIZER = new GifResizer();

    private final int SIZE_FOR_RESIZE = 256;

    public OutsideImageFolder(String pathToFolder) {
        super(pathToFolder);
    }

    @Override
    public File createNewFile(byte[] fileBytes, String fileName, boolean doNeedToGenerateRandomFileName) throws IOException {
        File file = super.createNewFile(fileBytes, fileName, doNeedToGenerateRandomFileName);

        if (file != null && file.exists()) {
            try {
                String extension = FILE_UTILS.getExtension(file.getName());
                if (IMAGE_UTILS.isExtensionSupportedForRead(extension)
                        && IMAGE_UTILS.isExtensionSupportedForWrite(extension)) {
                    file = extension.equalsIgnoreCase("gif")
                            ? GIF_RESIZER.resize(file, SIZE_FOR_RESIZE)
                            : IMAGE_RESIZER.resize(file, SIZE_FOR_RESIZE);
                } else {
                    throw new IOException(String.format("Формат '%s' не поддерживается", extension));
                }
            } catch (IOException e) {
                file.delete();
                throw new IOException(e.getMessage());
            }
        }

        return file;
    }
}
