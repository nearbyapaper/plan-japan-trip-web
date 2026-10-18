// รูปจาก Wikimedia Commons (ใช้ได้ตามสัญญาอนุญาตของแต่ละรูป ลิงก์ไปหน้าต้นฉบับอยู่ใน page)
// ดึงเมื่อ 18 ต.ค. 2026 จากรูปหลักของบทความ Wikipedia และหมวดหมู่ของสถานที่ใน Commons

export type Photo = { src: string; page: string; credit: string };

export const photos: Record<string, Photo[]> = {
  "crossing": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Kamakura-Koko-Mae_Station.jpg/960px-Kamakura-Koko-Mae_Station.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Kamakura-Koko-Mae_Station.jpg",
      "credit": "Quercus acuta · CC0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Kamakura_Koko_mae_Station_%2853149810226%29.jpg/960px-Kamakura_Koko_mae_Station_%2853149810226%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Kamakura_Koko_mae_Station_(53149810226).jpg",
      "credit": "Dick Thomas Johnson · CC BY 2.0"
    }
  ],
  "shichirigahama": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Shichirigahama_from_Inamuragasaki.jpg/960px-Shichirigahama_from_Inamuragasaki.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Shichirigahama_from_Inamuragasaki.jpg",
      "credit": "Urashimataro · Public domain"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/2_Chome_Shichirigahama%2C_Kamakura-shi%2C_Kanagawa-ken_248-0026%2C_Japan_-_panoramio_%2825%29.jpg/960px-2_Chome_Shichirigahama%2C_Kamakura-shi%2C_Kanagawa-ken_248-0026%2C_Japan_-_panoramio_%2825%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:2_Chome_Shichirigahama,_Kamakura-shi,_Kanagawa-ken_248-0026,_Japan_-_panoramio_(25).jpg",
      "credit": "運転太郎 · CC BY 3.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Enoden-1001.jpg/960px-Enoden-1001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Enoden-1001.jpg",
      "credit": "Nagara373 · CC BY-SA 4.0"
    }
  ],
  "inamuragasaki": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Inamuragasaki_-_01.jpg/960px-Inamuragasaki_-_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Inamuragasaki_-_01.jpg",
      "credit": "Quercus acuta · CC0"
    }
  ],
  "kotokuin": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/230128_Kamakura_Daibutsu_Japan04s3.jpg/960px-230128_Kamakura_Daibutsu_Japan04s3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:230128_Kamakura_Daibutsu_Japan04s3.jpg",
      "credit": "663highland · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Daibutsu_%40_Kotokuin_Temple_%40_Kamakura_%2813920956493%29.jpg/960px-Daibutsu_%40_Kotokuin_Temple_%40_Kamakura_%2813920956493%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Daibutsu_@_Kotokuin_Temple_@_Kamakura_(13920956493).jpg",
      "credit": "Guilhem Vellut from Annecy, France · CC BY 2.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Kamakura_-_Kamakura916.jpg/960px-Kamakura_-_Kamakura916.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Kamakura_-_Kamakura916.jpg",
      "credit": "lumoplank · CC0"
    }
  ],
  "tsurugaoka": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/TsurugaokaHachiman-M8867.jpg/960px-TsurugaokaHachiman-M8867.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:TsurugaokaHachiman-M8867.jpg",
      "credit": "Fg2 · Public domain"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Kamakura_6_%282386559855%29.jpg/960px-Kamakura_6_%282386559855%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Kamakura_6_(2386559855).jpg",
      "credit": "Stéphane Gallay from Laconnex, Switzerland · CC BY 2.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/2_Chome-1_Yukinoshita%2C_Kamakura-shi%2C_Kanagawa-ken_248-0005%2C_Japan_-_panoramio_%287%29.jpg/960px-2_Chome-1_Yukinoshita%2C_Kamakura-shi%2C_Kanagawa-ken_248-0005%2C_Japan_-_panoramio_%287%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:2_Chome-1_Yukinoshita,_Kamakura-shi,_Kanagawa-ken_248-0005,_Japan_-_panoramio_(7).jpg",
      "credit": "木村邦生 · CC BY 3.0"
    }
  ],
  "ohiRacecourse": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Ooi_Racecourse_Paddock_and_L-WING.jpg/960px-Ooi_Racecourse_Paddock_and_L-WING.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Ooi_Racecourse_Paddock_and_L-WING.jpg",
      "credit": "No machine-readable author provided. Goki assumed (based on  · CC BY 2.5"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Oi_race_course_entrance_north_gate.JPG/960px-Oi_race_course_entrance_north_gate.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Oi_race_course_entrance_north_gate.JPG",
      "credit": "Kamemaru2000 · CC BY-SA 3.0"
    }
  ],
  "omiyaPark": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Omiya_park_002.JPG/960px-Omiya_park_002.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Omiya_park_002.JPG",
      "credit": "Ocdp · CC0"
    }
  ],
  "arena": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Saitama_Super_Arena_02.jpg/960px-Saitama_Super_Arena_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Saitama_Super_Arena_02.jpg",
      "credit": "Kakidai · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Saitama_Super_Arena_01.jpg/960px-Saitama_Super_Arena_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Saitama_Super_Arena_01.jpg",
      "credit": "Kakidai · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Saitama_Super_Arena-2015-11-01.jpg/960px-Saitama_Super_Arena-2015-11-01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Saitama_Super_Arena-2015-11-01.jpg",
      "credit": "掬茶 · CC BY-SA 4.0"
    }
  ],
  "cocoon": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Cocoon_City_Saitama-Shintoshin_-_Cocoon2_20151101.jpg/960px-Cocoon_City_Saitama-Shintoshin_-_Cocoon2_20151101.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Cocoon_City_Saitama-Shintoshin_-_Cocoon2_20151101.jpg",
      "credit": "掬茶 · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Cocoon_City_Saitama-Shintosin_%28Gate%29.JPG/960px-Cocoon_City_Saitama-Shintosin_%28Gate%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Cocoon_City_Saitama-Shintosin_(Gate).JPG",
      "credit": "Orataw · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/COCOON_Shintoshin_20090409.JPG/960px-COCOON_Shintoshin_20090409.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:COCOON_Shintoshin_20090409.JPG",
      "credit": "掬茶 · CC BY-SA 4.0"
    }
  ],
  "hakoneen": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/211126_Hakone-en_Station_Hakone_Japan03s3.jpg/960px-211126_Hakone-en_Station_Hakone_Japan03s3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:211126_Hakone-en_Station_Hakone_Japan03s3.jpg",
      "credit": "663highland · CC BY-SA 4.0"
    }
  ],
  "hakoneShrine": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Hakonejinja_-01.jpg/960px-Hakonejinja_-01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Hakonejinja_-01.jpg",
      "credit": "Aimaimyi · CC BY-SA 3.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Omikuji_-_Hakone-jinja_-_Hakone%2C_Japan_-_DSC05833.jpg/960px-Omikuji_-_Hakone-jinja_-_Hakone%2C_Japan_-_DSC05833.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Omikuji_-_Hakone-jinja_-_Hakone,_Japan_-_DSC05833.jpg",
      "credit": "Daderot · Public domain"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Hakone_Shrine_%2813776532723%29.jpg/960px-Hakone_Shrine_%2813776532723%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Hakone_Shrine_(13776532723).jpg",
      "credit": "Guilhem Vellut from Annecy, France · CC BY 2.0"
    }
  ],
  "motohakone": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/260505_Moto-Hakone_Hakone_Japan01s3.jpg/960px-260505_Moto-Hakone_Hakone_Japan01s3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:260505_Moto-Hakone_Hakone_Japan01s3.jpg",
      "credit": "663highland · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Ashinoko_Lake_-_Hakone%2C_Japan_-_DSC05555.jpg/960px-Ashinoko_Lake_-_Hakone%2C_Japan_-_DSC05555.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Ashinoko_Lake_-_Hakone,_Japan_-_DSC05555.jpg",
      "credit": "Daderot · CC0"
    }
  ],
  "kawaguchiko": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/KawaguchiKo.jpg/960px-KawaguchiKo.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:KawaguchiKo.jpg",
      "credit": "BehBeh · CC BY-SA 3.0"
    }
  ],
  "ohashi": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/170505_Lake_Kawaguchi_Japan02s3.jpg/960px-170505_Lake_Kawaguchi_Japan02s3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:170505_Lake_Kawaguchi_Japan02s3.jpg",
      "credit": "663highland · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Lake_Kawaguchi%2C_Kawaguchi_-_panoramio.jpg/960px-Lake_Kawaguchi%2C_Kawaguchi_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Lake_Kawaguchi,_Kawaguchi_-_panoramio.jpg",
      "credit": "dres2222 · CC BY-SA 3.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Lake_Kawaguchiko_Ohashi_Bridge_%2816031531337%29.jpg/960px-Lake_Kawaguchiko_Ohashi_Bridge_%2816031531337%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Lake_Kawaguchiko_Ohashi_Bridge_(16031531337).jpg",
      "credit": "redlegsfan21 · CC BY-SA 2.0"
    }
  ],
  "shimokitazawa": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Shimokitazawa_Street_2015.jpg/960px-Shimokitazawa_Street_2015.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Shimokitazawa_Street_2015.jpg",
      "credit": "Aw1805 · CC BY-SA 4.0"
    }
  ],
  "komachi": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Komachi-dori_%40_Kamakura_%289399478395%29.jpg/960px-Komachi-dori_%40_Kamakura_%289399478395%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Komachi-dori_@_Kamakura_(9399478395).jpg",
      "credit": "Guilhem Vellut from Annecy, France · CC BY 2.0"
    }
  ],
  "morito": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Morito_Jinja_part1.JPG/960px-Morito_Jinja_part1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Morito_Jinja_part1.JPG",
      "credit": "Mizunoumi · CC BY-SA 3.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Morito_shrine_Kanagawa_-_2024_12_12_night_-_various.jpeg/960px-Morito_shrine_Kanagawa_-_2024_12_12_night_-_various.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Morito_shrine_Kanagawa_-_2024_12_12_night_-_various.jpeg",
      "credit": "Nesnad · CC BY 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Morito_shrine_Kanagawa_-_2024_12_12_night_-_various_17_25_34_691000.jpeg/960px-Morito_shrine_Kanagawa_-_2024_12_12_night_-_various_17_25_34_691000.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Morito_shrine_Kanagawa_-_2024_12_12_night_-_various_17_25_34_691000.jpeg",
      "credit": "Nesnad · CC BY 4.0"
    }
  ],
  "hayamaMarina": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Hayama_Port.jpg/960px-Hayama_Port.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Hayama_Port.jpg",
      "credit": "Quercus acuta · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/%E8%90%BD%E9%99%BD.%E8%91%89%E5%B1%B1%E6%B8%AF%E3%81%A7%E6%92%AE%E5%BD%B1_Pcs34560_IMG5841.jpg/960px-%E8%90%BD%E9%99%BD.%E8%91%89%E5%B1%B1%E6%B8%AF%E3%81%A7%E6%92%AE%E5%BD%B1_Pcs34560_IMG5841.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:%E8%90%BD%E9%99%BD.%E8%91%89%E5%B1%B1%E6%B8%AF%E3%81%A7%E6%92%AE%E5%BD%B1_Pcs34560_IMG5841.jpg",
      "credit": "pcs34560 · Public domain"
    }
  ],
  "hikawa": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/%E6%B0%B7%E5%B7%9D%E7%A5%9E%E7%A4%BE_%E9%A1%8D%E6%AE%BF.JPG/960px-%E6%B0%B7%E5%B7%9D%E7%A5%9E%E7%A4%BE_%E9%A1%8D%E6%AE%BF.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:%E6%B0%B7%E5%B7%9D%E7%A5%9E%E7%A4%BE_%E9%A1%8D%E6%AE%BF.JPG",
      "credit": "Saigen Jiro · Public domain"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Hikawa_Shrine_%40_Omiya_%2813593513453%29.jpg/960px-Hikawa_Shrine_%40_Omiya_%2813593513453%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Hikawa_Shrine_@_Omiya_(13593513453).jpg",
      "credit": "Guilhem Vellut from Annecy, France · CC BY 2.0"
    }
  ],
  "oishiPark": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Oishi_in_Fujikawaguchiko_01.jpg/960px-Oishi_in_Fujikawaguchiko_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Oishi_in_Fujikawaguchiko_01.jpg",
      "credit": "Olaf2 · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Oishi_in_Fujikawaguchiko_04.jpg/960px-Oishi_in_Fujikawaguchiko_04.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Oishi_in_Fujikawaguchiko_04.jpg",
      "credit": "Olaf2 · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Oishi_in_Fujikawaguchiko_10.jpg/960px-Oishi_in_Fujikawaguchiko_10.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Oishi_in_Fujikawaguchiko_10.jpg",
      "credit": "Olaf2 · CC BY-SA 4.0"
    }
  ],
  "yagisaki": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/%E3%83%A9%E3%83%99%E3%83%B3%E3%83%80%E3%83%BC%E3%81%A8%E5%A4%8F%E3%81%AE%E6%B9%96%28Field_of_Lavender_in_Kawaguchiko%29_17_Jul%2C_2015_-_panoramio.jpg/960px-%E3%83%A9%E3%83%99%E3%83%B3%E3%83%80%E3%83%BC%E3%81%A8%E5%A4%8F%E3%81%AE%E6%B9%96%28Field_of_Lavender_in_Kawaguchiko%29_17_Jul%2C_2015_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:%E3%83%A9%E3%83%99%E3%83%B3%E3%83%80%E3%83%BC%E3%81%A8%E5%A4%8F%E3%81%AE%E6%B9%96(Field_of_Lavender_in_Kawaguchiko)_17_Jul,_2015_-_panoramio.jpg",
      "credit": "Hiroaki Kaneko · CC BY-SA 3.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Lake_Kawaguchiko_%2810863247193%29.jpg/960px-Lake_Kawaguchiko_%2810863247193%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Lake_Kawaguchiko_(10863247193).jpg",
      "credit": "Guilhem Vellut from Annecy, France · CC BY 2.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Lake_Kawaguchiko_%40_Fujikawaguchiko_%2813924872980%29.jpg/960px-Lake_Kawaguchiko_%40_Fujikawaguchiko_%2813924872980%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Lake_Kawaguchiko_@_Fujikawaguchiko_(13924872980).jpg",
      "credit": "Guilhem Vellut from Annecy, France · CC BY 2.0"
    }
  ],
  "busta": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Shinjuku_Expressway_Bus_Terminal_2020-04-19.jpg/960px-Shinjuku_Expressway_Bus_Terminal_2020-04-19.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Shinjuku_Expressway_Bus_Terminal_2020-04-19.jpg",
      "credit": "Asanagi · CC0"
    }
  ],
  "lawsonKawaguchiko": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%A7%85%E5%89%8D%E5%BA%97_%2854218169430%29.jpg/960px-%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%A7%85%E5%89%8D%E5%BA%97_%2854218169430%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%A7%85%E5%89%8D%E5%BA%97_(54218169430).jpg",
      "credit": "Jeffrey Hayes · CC BY 2.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%A7%85%E5%89%8D%E5%BA%97_%2854217996678%29.jpg/960px-%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%A7%85%E5%89%8D%E5%BA%97_%2854217996678%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%A7%85%E5%89%8D%E5%BA%97_(54217996678).jpg",
      "credit": "Jeffrey Hayes · CC BY 2.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Lawson_Fuji.jpg/960px-Lawson_Fuji.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "page": "https://commons.wikimedia.org/wiki/File:Lawson_Fuji.jpg",
      "credit": "Gabriel Hutchinson Photography · CC BY-SA 4.0"
    }
  ],
  "owakudani": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/A_view_of_Owakudani_-_a_volcanic_valley_with_active_sulphur_vents_and_hot_springs_in_Hakone%2C_Japan.jpg/960px-A_view_of_Owakudani_-_a_volcanic_valley_with_active_sulphur_vents_and_hot_springs_in_Hakone%2C_Japan.jpg",
      "page": "https://commons.wikimedia.org/wiki/File:A_view_of_Owakudani_-_a_volcanic_valley_with_active_sulphur_vents_and_hot_springs_in_Hakone,_Japan.jpg",
      "credit": "Joli Rumi · CC BY-SA 4.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Owakudani_Valley_near_Owakudani_Station.JPG/960px-Owakudani_Valley_near_Owakudani_Station.JPG",
      "page": "https://commons.wikimedia.org/wiki/File:Owakudani_Valley_near_Owakudani_Station.JPG",
      "credit": "そらみみ · CC BY-SA 3.0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/%C5%8Cwakudani_20211202-1.jpg/960px-%C5%8Cwakudani_20211202-1.jpg",
      "page": "https://commons.wikimedia.org/wiki/File:%C5%8Cwakudani_20211202-1.jpg",
      "credit": "Suicasmo · CC BY-SA 4.0"
    }
  ],
  "togendai": [
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Hakone_Ropeway_-_Hakone%2C_Kanagawa%2C_Japan_-_DSC07952.jpg/960px-Hakone_Ropeway_-_Hakone%2C_Kanagawa%2C_Japan_-_DSC07952.jpg",
      "page": "https://commons.wikimedia.org/wiki/File:Hakone_Ropeway_-_Hakone,_Kanagawa,_Japan_-_DSC07952.jpg",
      "credit": "Daderot · CC0"
    },
    {
      "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Hakone_Ropeway_1.jpg/960px-Hakone_Ropeway_1.jpg",
      "page": "https://commons.wikimedia.org/wiki/File:Hakone_Ropeway_1.jpg",
      "credit": "っ · CC BY-SA 3.0"
    }
  ]
};
