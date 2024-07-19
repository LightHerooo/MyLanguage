package ru.herooo.mylanguageutils.outsidefolder.types;

import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.ProjectPaths;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class OutsideFolder {
    private final StringUtils STRING_UTILS = new StringUtils();
    private final FileUtils FILE_UTILS = new FileUtils();

    private final String PATH;

    public OutsideFolder(String path) {
        this.PATH = String.format("%s%s", ProjectPaths.MAIN_FOLDER.PATH, path);
    }

    public File getFolder() {
        File folder = new File(PATH);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        return folder;
    }

    public File getFile(String fileName) {
        File result = null;

        File folder = getFolder();
        if (folder != null && folder.exists()) {
            File[] files = folder.listFiles((dir, name) -> name.equals(fileName));
            if (files != null && files.length > 0) {
                result = files[0];
            }
        }

        return result;
    }

    public File createNewFile(byte[] fileBytes, String fileName, boolean doNeedToGenerateRandomFileName) throws IOException {
        File newFile = null;
        if (!STRING_UTILS.isStringVoid(fileName)) {
            String filePath;
            if (doNeedToGenerateRandomFileName) {
                String randomFileName = String.format("%s.%s",
                        STRING_UTILS.createRandomStrEn(30), FILE_UTILS.getExtension(fileName));
                filePath = String.format("%s/%s", getFolder().getPath(), randomFileName);
            } else {
                filePath = String.format("%s/%s", getFolder().getPath(), fileName);
            }

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.write(fileBytes);
            }

            newFile = getFile(FILE_UTILS.getFileName(filePath));
        }

        return newFile;
    }

    public void deleteFile(String fileName) {
        File file = getFile(fileName);
        if (file != null) {
            file.delete();
        }
    }
}
