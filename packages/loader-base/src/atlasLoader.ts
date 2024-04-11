import { TextureAtlas } from '@pixi-v8-patch-spine/base';
import { type AssetExtension, LoaderParserPriority, Loader, checkExtension, DOMAdapter } from 'pixi.js';
import { TextureSource, extensions, ExtensionType, Texture, path } from 'pixi.js';
import type { ISpineMetadata } from './SpineLoaderAbstract';
import type { LoadAsset } from './SpineLoaderAbstract';

type RawAtlas = string;

const spineTextureAtlasLoader: AssetExtension<RawAtlas | TextureAtlas, ISpineMetadata> = {
    extension: ExtensionType.Asset,

    // cache: {
    //     test: (asset: RawAtlas | TextureAtlas) => asset instanceof TextureAtlas,
    //     getCacheableAssets: (keys: string[], asset: RawAtlas | TextureAtlas) => getCacheableAssets(keys, asset),
    // },

    loader: {
        extension: {
            type: ExtensionType.LoadParser,
            priority: LoaderParserPriority.Normal,
        },

        test(url: string): boolean {
            return checkExtension(url, '.atlas');
        },

        async load(url: string): Promise<RawAtlas> {
            const response = await DOMAdapter.get().fetch(url);

            const txt = await response.text();

            return txt as RawAtlas;
        },

        testParse(asset: unknown, options: LoadAsset): Promise<boolean> {
            const isExtensionRight = checkExtension(options.src, '.atlas');
            const isString = typeof asset === 'string';

            return Promise.resolve(isExtensionRight && isString);
        },

        async parse(asset: RawAtlas, options: LoadAsset, loader: Loader): Promise<TextureAtlas> {
            const metadata: ISpineMetadata = options.data;
            let basePath = path.dirname(options.src);

            if (basePath && basePath.lastIndexOf('/') !== basePath.length - 1) {
                basePath += '/';
            }

            let resolve = null;
            let reject = null;
            const retPromise = new Promise<TextureAtlas>((res, rej) => {
                resolve = res;
                reject = rej;
            });

            // Retval is going to be a texture atlas. However we need to wait for it's callback to resolve this promise.
            let retval;
            const resolveCallback = (newAtlas: TextureAtlas): void => {
                if (!newAtlas) {
                    reject('Something went terribly wrong loading a spine .atlas file\nMost likely your texture failed to load.');
                }
                resolve(retval);
            };

            // if we have an already loaded pixi image in the image field, use that.
            if (metadata.image || metadata.images) {
                // merge the objects
                const pages = Object.assign(metadata.image ? { default: metadata.image } : {}, metadata.images);

                retval = new TextureAtlas(
                    asset as RawAtlas,
                    (line: any, callback: any) => {
                        const page = pages[line] || (pages.default as any);

                        if (page && page.baseTexture) callback(page.baseTexture);
                        else callback(page);
                    },
                    resolveCallback
                );
            } else {
                // We don't have ready to use pixi textures, we need to load them now!
                retval = new TextureAtlas(asset as RawAtlas, makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject(loader, basePath, metadata.imageMetadata), resolveCallback);
            }

            return (await retPromise) as TextureAtlas;
        },

        unload(atlas: TextureAtlas) {
            atlas.dispose();
        },
    },
} as AssetExtension<RawAtlas | TextureAtlas, ISpineMetadata>;

/**
 * Ugly function to promisify the spine texture atlas loader function.
 * @public
 */
export const makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject = (loader: Loader, atlasBasePath: string, imageMetadata: any) => {
    return async (pageName: string, textureLoadedCallback: (tex: TextureSource) => any): Promise<void> => {
        // const url = utils.path.join(...atlasBasePath.split(utils.path.sep), pageName); // Broken in upstream

        const url = path.normalize([...atlasBasePath.split(path.sep), pageName].join(path.sep));

        const texture = await loader.load<Texture>({ src: url, data: imageMetadata });

        textureLoadedCallback(texture.source);
    };
};

extensions.add(spineTextureAtlasLoader);
