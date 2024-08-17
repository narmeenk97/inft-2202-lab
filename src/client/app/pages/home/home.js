import '../../../img/eclairs.jpg';
import '../../../img/istockphoto-114335947-612x612.jpg';
import '../../../img/istockphoto-139885298-612x612.jpg';
import '../../../img/istockphoto-160239364-612x612.jpg';
import '../../../img/istockphoto-497959594-612x612.jpg';
import '../../../img/cake.jpg';
import tmplHome from './home.ejs';
import 'bootstrap';

export default async () => {
    const strHome = tmplHome();
    document.getElementById('app').innerHTML = strHome;

}

