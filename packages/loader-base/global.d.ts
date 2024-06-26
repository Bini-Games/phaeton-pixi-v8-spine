declare namespace GlobalMixins
{
    interface IResourceMetadata {
        spineSkeletonScale?: number;
        spineAtlas?: any;
        spineAtlasFile?: string;
        spineMetadata?: any;
        imageNamePrefix?: string;
        atlasRawData?: string;
        imageLoader?: any;
        images?: any;
        imageMetadata?: any;
        image?: any;
    }

    interface LoaderResource {
        spineAtlas?: import('@pixi-v8-patch-spine/base').TextureAtlas;
    }
}
