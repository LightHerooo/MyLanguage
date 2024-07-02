package ru.herooo.mylanguageutils.file;

import ru.herooo.mylanguageutils.file.filesize.FileSize;
import ru.herooo.mylanguageutils.file.mimetype.MimeType;

public class MimeTypeWithSize {
    private MimeType mimeType;
    private FileSize fileSize;

    public MimeTypeWithSize(MimeType mimeType, FileSize fileSize) {
        this.mimeType = mimeType;
        this.fileSize = fileSize;
    }

    public MimeType getMimeType() {
        return mimeType;
    }

    public void setMimeType(MimeType mimeType) {
        this.mimeType = mimeType;
    }

    public FileSize getFileSize() {
        return fileSize;
    }

    public void setFileSize(FileSize fileSize) {
        this.fileSize = fileSize;
    }
}
