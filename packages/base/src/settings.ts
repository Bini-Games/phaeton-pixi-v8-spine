/**
 * @public
 */
export const settings = {
    yDown: true,
    /**
     * pixi-v8-patch-spine gives option to not fail at certain parsing errors
     * spine-ts fails here
     */
    FAIL_ON_NON_EXISTING_SKIN: false,

    /**
     * past Spine.globalAutoUpdate
     */
    GLOBAL_AUTO_UPDATE: true,

    /**
     * past Spine.globalDelayLimit
     */
    GLOBAL_DELAY_LIMIT: 0,
};
