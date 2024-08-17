import '../../../img/IMG_1402.JPG';
//import '../../../img/watercolor-light-peach-background_23-2150268724.avif';
import tmplAbout from './about.ejs';

export default async () => {
    const strAbout = tmplAbout();
    document.getElementById('app').innerHTML = strAbout;
}
