import requests
from bs4 import BeautifulSoup
import os
import base64
from PIL import Image
from io import BytesIO

def scrape_query(key, url):
    query = key
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    image_tags = soup.find_all('img')

    directory = 'downloads/' + query

    if not os.path.exists(directory):
        os.makedirs(directory)

    for i, img_tag  in enumerate(image_tags):
        img_url = img_tag.get('src')
        img_name = os.path.basename(img_url)

        if img_url.startswith('/'):
            continue
        

        if img_url.startswith("data:"):
            base64_string = image_url
            data = base64_string.split(',')[1]  # Ignore the data:image/... part
            image_bytes = base64.b64decode(data)
            image = Image.open(BytesIO(image_bytes))
            image.save(i + ".jpg")
        else:
            print(img_url)
            img_data = requests.get(img_url).content
            with open(os.path.join(directory, img_name), 'wb') as handler:
                handler.write(img_data)
        


scrape_query('women', 'https://www.google.com/search?q=women%20profiles%20selfies&tbm=isch&hl=en&tbs=isz:l&authuser=0&sa=X&ved=0CAIQpwVqFwoTCKCOifezyoIDFQAAAAAdAAAAABAE&biw=1920&bih=529')

scrape_query('men', 'https://www.google.com/search?q=men+profiles+selfies&tbm=isch&ved=2ahUKEwjngsz8s8qCAxVQF2IAHZO4AvUQ2-cCegQIABAA&oq=men+profiles+selfies&gs_lcp=CgNpbWcQAzoECCMQJ1DrB1j5DmDPEWgAcAB4AIABaIgB5wKSAQMzLjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=HQhXZaeAGtCuiLMPk_GKqA8&authuser=0&bih=529&biw=1920&hl=en')
