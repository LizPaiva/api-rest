
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/'
});
api.defaults.headers.common['X-API-KEY'] = 'live_roby6c7t8K6njHIfqYQTtHVTMd1GEDse2Y0XmSZawNBzFCQ4haq1dIRJ37KNZoyW'

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_roby6c7t8K6njHIfqYQTtHVTMd1GEDse2Y0XmSZawNBzFCQ4haq1dIRJ37KNZoyW';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error')

  async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    console.log('Random')
    console.log(data)

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
      
       
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavouriteMichi(data[0].id);
        btn2.onclick = () => saveFavouriteMichi(data[1].id);
       }
    }
   

  
  async function loadFavouriteMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_roby6c7t8K6njHIfqYQTtHVTMd1GEDse2Y0XmSZawNBzFCQ4haq1dIRJ37KNZoyW',
        },
    });
    const data = await res.json();
    console.log('Favoritos')
    console.log(data)


    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        const section = document.getElementById('favouriteMichis')
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Gatitos favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(michi => {
            
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');

            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouriteMichi(michi.id);
            img.src = michi.image.url;
            img.width = 150;


        article.appendChild(img);
        article.appendChild(btn);
        section.appendChild(article);

        });
    }

  }

  async function saveFavouriteMichi(id) {
    const { data, status } = await api.post('/favourites', {
        image_id: id,
    });


    /*const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_roby6c7t8K6njHIfqYQTtHVTMd1GEDse2Y0XmSZawNBzFCQ4haq1dIRJ37KNZoyW',
        },
        body: JSON.stringify({
            image_id: id
        }),
    });

    const data = await res.json();*/

    console.log('save')
  
    
    if (status !== 200) {
        spanError.innerHTML = "Hubo un error: " + status + data.message;
    } else {
        console.log('Michi guardado en favoritos')
        loadFavouriteMichis();
    }

  }

  async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_roby6c7t8K6njHIfqYQTtHVTMd1GEDse2Y0XmSZawNBzFCQ4haq1dIRJ37KNZoyW',
        }
    });

    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos')
        loadFavouriteMichis();
    }
  }
  
  async function uploadMichiFoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form);

    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'live_roby6c7t8K6njHIfqYQTtHVTMd1GEDse2Y0XmSZawNBzFCQ4haq1dIRJ37KNZoyW',
        },
        body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
        console.log({data})
    } else {
        console.log('Foto de michi subida')
        console.log(data.url);
        saveFavouriteMichi(data.id)
        
    }

  }

  loadRandomMichis();
  loadFavouriteMichis();