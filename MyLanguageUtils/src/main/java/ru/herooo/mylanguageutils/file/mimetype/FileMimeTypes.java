package ru.herooo.mylanguageutils.file.mimetype;

public enum FileMimeTypes {
    ALL(new MimeType("*", "*"))
    ;

    public final MimeType MIME_TYPE;

    FileMimeTypes(MimeType mimeType) {
        this.MIME_TYPE = mimeType;
    }
}
