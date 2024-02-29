let isLoading = false;
type LoadAllAssetsCallback = (progress: number) => void;

export const loadAllAssets = (callback: LoadAllAssetsCallback) => {
  if (!isLoading) {
    let totalLoadedCount = 0;
    isLoading = true;
    const servants = Object.values(import.meta.glob('@/assets/servants/*.{png,jpg,jpeg}', { eager: true, as: 'url' }));
    const card = Object.values(import.meta.glob('@/assets/card/*.{png,jpg,webp}', { eager: true, as: 'url' }));
    const icons = Object.values(import.meta.glob('@/assets/icons/*.{png,jpg,jpeg}', { eager: true, as: 'url' }));
    const images = Object.values(import.meta.glob('@/assets/images/*.{png,jpg,jpeg}', { eager: true, as: 'url' }));

    const assets = servants.concat(card).concat(icons).concat(images);
    const totalCount = assets.length;
    for (const path of assets) {
      fetch(new URL(path, import.meta.url).href).then(() => {
        totalLoadedCount+= 1;
        callback(totalLoadedCount / totalCount);
      })
    }
  }
}
