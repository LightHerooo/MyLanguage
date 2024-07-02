package ru.herooo.mylanguageutils.file;

import ru.herooo.mylanguageutils.StringUtils;

public class FileUtils {
    private final StringUtils STRING_UTILS = new StringUtils();

    public String getExtension(String fileName) {
        String extension = null;

        if (!STRING_UTILS.isStringVoid(fileName)) {
            int dotIndex = fileName.lastIndexOf('.');
            if (dotIndex != -1) {
                extension = fileName.substring(dotIndex + 1);
            }
        }

        return extension;
    }

    public String getPathWithoutFileName(String filePath) {
        String result = null;

        if (!STRING_UTILS.isStringVoid(filePath)) {
            int slashIndex = filePath.lastIndexOf("/");
            if (slashIndex == -1) {
                slashIndex = filePath.lastIndexOf('\\');
            }

            if (slashIndex != -1) {
                result = filePath.substring(0, slashIndex);
            }
        }

        return result;
    }

    public String getFileName(String filePath) {
        String result = null;

        if (!STRING_UTILS.isStringVoid(filePath)) {
            int slashIndex = filePath.lastIndexOf("/");
            if (slashIndex == -1) {
                slashIndex = filePath.lastIndexOf('\\');
            }

            if (slashIndex != -1) {
                result = filePath.substring(slashIndex + 1);
            }
        }

        return result;
    }
}
