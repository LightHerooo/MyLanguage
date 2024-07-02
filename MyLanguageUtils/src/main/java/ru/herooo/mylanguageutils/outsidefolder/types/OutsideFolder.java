package ru.herooo.mylanguageutils.outsidefolder.types;

import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.StringUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class OutsideFolder {
    private final String MAIN_OUTSIDE_FOLDER_PATH = System.getProperty("user.dir");
    private final StringUtils STRING_UTILS = new StringUtils();
    private final FileUtils FILE_UTILS = new FileUtils();

    private final String PATH_TO_FOLDER;

    public OutsideFolder(String pathToFolder) {
        this.PATH_TO_FOLDER = String.format("%s%s", MAIN_OUTSIDE_FOLDER_PATH, pathToFolder);
    }

    public File getFolder() {
        File folder = new File(PATH_TO_FOLDER);
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

    public File createNewFile(byte[] fileBytes, String fileName) throws IOException {
        File newFile = null;
        if (!STRING_UTILS.isStringVoid(fileName)) {
            String extension = FILE_UTILS.getExtension(fileName);
            String newFileName = String.format("%s.%s",
                    STRING_UTILS.createRandomStrEn(30), extension) ;

            String filePath = String.format("%s/%s", getFolder().getPath(), newFileName);
            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.write(fileBytes);
            }

            newFile = getFile(newFileName);
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
