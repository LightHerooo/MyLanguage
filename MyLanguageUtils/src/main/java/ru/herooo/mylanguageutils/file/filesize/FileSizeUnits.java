package ru.herooo.mylanguageutils.file.filesize;

public enum FileSizeUnits {
    KB ("KB", 1024),
    MB ("MB", KB.NUMBER_OF_BYTES * 1024)
    ;


    final String TITLE;
    final long NUMBER_OF_BYTES;
    FileSizeUnits(String title, long numberOfBytes) {
        this.TITLE = title;
        this.NUMBER_OF_BYTES = numberOfBytes;
    }
}
