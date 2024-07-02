package ru.herooo.mylanguageutils.outsidefolder;

import ru.herooo.mylanguageutils.outsidefolder.types.OutsideFolder;
import ru.herooo.mylanguageutils.outsidefolder.types.OutsideImageFolder;

public enum OutsideFolders {
    AVATARS(new OutsideImageFolder("/avatars"))
    ;

    public final OutsideFolder FOLDER;
    OutsideFolders(OutsideFolder folder) {
        this.FOLDER = folder;
    }
}
