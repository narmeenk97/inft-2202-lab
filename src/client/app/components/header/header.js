import '../../../img/240_F_692232472_Fci1D4gmtbHt5EBZYJfXBX6DYIYmVXCA.jpg';
import tmplHeader from './header.ejs';

export default async () => {
    const strHeader = tmplHeader();

    document.getElementById('app').insertAdjacentHTML('beforebegin', strHeader);
}