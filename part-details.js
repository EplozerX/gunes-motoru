// Parça pencerelerinin Türkçe içeriği. Yerleşim bilgileri devre şeması değildir.
window.PART_DETAILS = {
  base: {
    category: "Yapı ve yerleşim",
    tagline: "Bütün sistemi bir arada tutan çalışma alanı.",
    overview: [
      {
        title: "Düzenli bir maket",
        text: "Panel, elektronik kartlar ve motor aynı tabanda sabitlenir. Parçalar arasında bırakılan boşluklar hem incelemeyi hem de kabloları takip etmeyi kolaylaştırır.",
      },
      {
        title: "Yerleşim, bağlantı değildir",
        text: "3D model parçaların konumunu anlatır. Kablo çizgileri pinleri, kutupları veya gerçek bir devrenin bütün bağlantılarını tarif etmez.",
      },
    ],
    physics: [
      {
        title: "Dengede kalmak",
        text: "Ağırlık merkezinin düşey izdüşümü destek alanı içinde kaldığında maket devrilmeye karşı dengededir. Yüksek panel standı ve dönen parçalar yerleşim kararını etkiler.",
      },
      {
        title: "Titreşimi sınırlamak",
        text: "Dengesiz dönen parçalar desteklere değişken kuvvet uygular. Sağlam bağlantılar ve dengeli bir pervane, bu titreşimin tabana aktarılmasını azaltır.",
      },
    ],
    safety: [
      {
        title: "Kartların altında boşluk",
        text: "Kartları uygun yalıtkan ara parçalarla yükseltin. İletken vida, tel ucu veya metal parçalar kartın altındaki bağlantılara değmemelidir.",
      },
      {
        title: "Kablolara güvenli yol",
        text: "Kabloları dönen mil ve pervaneden uzak tutup sabitleyin. Yerleşim değiştirirken önce enerji bağlantısını ayırın.",
      },
    ],
    fact: { label: "Maket boyutu", value: "Yaklaşık 45 × 30 cm" },
    accent: "#c49b6c",
  },
  solar: {
    category: "Enerji kaynağı",
    tagline: "Yolculuk, ışığın elektriğe dönüşmesiyle başlıyor.",
    overview: [
      {
        title: "Güneşten gelen enerji",
        text: "Panel, fotovoltaik hücrelerden oluşur. Ürettiği elektrik önce uyumlu şarj kontrolüne gider; burada gösterilen akış, kesin pin bağlantısı değildir.",
      },
      {
        title: "Stand neden eğimli?",
        text: "Stand, panelin ışığa göre açısını ayarlamaya yarar. Gölgelenme, bulutlar ve panelin yönü, elde edilebilen elektrik gücünü değiştirir.",
      },
    ],
    physics: [
      {
        title: "Fotovoltaik etki",
        text: "Işık, yarı iletken içindeki yük taşıyıcılarına enerji aktarır. Hücrenin yapısı bu yükleri ayırır; uygun bir devre tamamlandığında akım oluşur.",
      },
      {
        title: "Gerilim tek başına yetmez",
        text: "Elektrik gücü P = U × I bağıntısıyla hesaplanır. Panelin uçlarında gerilim görülmesi, o anda motoru çalıştıracak kadar güç üretebildiği anlamına gelmez.",
      },
    ],
    safety: [
      {
        title: "Etiketteki değer başlangıçtır",
        text: "Nominal gerilim ile açık devre gerilimi farklıdır. Panelin en yüksek gerilimi ve bağlantı kutupları, seçilen şarj kartının belgeleriyle eşleştirilmelidir.",
      },
      {
        title: "Pile giden yol",
        text: "Li-ion hücreyi doğrudan panele bağlamayın. Panelin değişen çıkışı ile hücrenin şarj koşullarını uyumlu bir şarj kontrolü yönetmelidir.",
      },
    ],
    fact: { label: "Enerji dönüşümü", value: "Işık → elektrik" },
    accent: "#e9ad46",
  },
  charge: {
    category: "Şarj yönetimi",
    tagline: "Değişen güneş enerjisini pilin ihtiyaçlarıyla buluşturur.",
    overview: [
      {
        title: "Şarjın yöneticisi",
        text: "Kart, hücreye aktarılan akımı ve şarj gerilimini yönetir. Panel, pil kimyası ve hücre sayısı, kart seçiminde birlikte değerlendirilir.",
      },
      {
        title: "Çalışırken şarj",
        text: "Motor ve elektronik şarj sırasında da çalışacaksa yükün enerjiyi nereden aldığı önemlidir. Güç yolu veya yük paylaşımı desteği, pil şarjının yükten doğru biçimde ayrılmasını sağlar.",
      },
    ],
    physics: [
      {
        title: "Elektrikten kimyasal enerjiye",
        text: "Şarj sırasında dış kaynak, hücre içindeki kimyasal süreçleri enerji depolama yönünde sürdürür. Enerjinin bir bölümü devrede ve hücrede ısıya dönüşür.",
      },
      {
        title: "Neden kontrollü şarj?",
        text: "Standart 1S Li-ion şarjında önce akım, ardından üst sınıra yaklaşırken gerilim denetlenir. Son aşamada akım azalır; uygulanacak sınırlar hücrenin belgelerine bağlıdır.",
      },
    ],
    safety: [
      {
        title: "Şarj ve koruma ayrı işler",
        text: "Pil koruması aşırı durumlarda devreyi kesmeyi amaçlar; normal şarj sürecini yönetmez. Koruma devreli hücre de uyumlu bir şarj kartına ihtiyaç duyar.",
      },
      {
        title: "Kart adından emin olun",
        text: "Her USB şarj modülü güneş panelinin değişken kaynağına uygun değildir. Giriş aralığı, hücre kimyası, şarj akımı ve yük paylaşımı gerçek ürün üzerinden doğrulanmalıdır.",
      },
    ],
    fact: { label: "Standart 1S Li-ion örneği", value: "Tam şarj: 4,2 V" },
    accent: "#71ba91",
  },
  battery: {
    category: "Enerji depolama",
    tagline: "Işık değişirken sisteme enerji rezervi sağlar.",
    overview: [
      {
        title: "Panel ile yük arasında",
        text: "Hücre, uygun şarj devresiyle aldığı enerjiyi depolar. Böylece tüketim anı ile güneşten enerji toplama anı birbirinden ayrılabilir.",
      },
      {
        title: "Yuva ne işe yarar?",
        text: "Yuva hücreyi mekanik olarak tutar ve uygun elektrik temasını sağlar. Koruma devreli hücrelerin boyu değişebildiği için hücre ve yuva birlikte seçilmelidir.",
      },
    ],
    physics: [
      {
        title: "İki yönde enerji dönüşümü",
        text: "Şarjda elektrik enerjisi kimyasal enerjiye, kullanımda kimyasal enerji elektrik enerjisine dönüşür. Bu dönüşümlerde kayıplar olduğu için enerji bütçesine ısı da dahildir.",
      },
      {
        title: "Kapasite ve doluluk farklıdır",
        text: "Kapasite, hücrenin belirli koşullarda verebildiği yükü anlatır; doluluk o anda kalan payın tahminidir. Uç gerilimi, yük akımı ve sıcaklık da değiştiğinden tek ölçüm kesin yüzde vermez.",
      },
    ],
    safety: [
      {
        title: "Kısa devreyi önleyin",
        text: "Hücrenin uçlarını metal bir cisimle birleştirmeyin. Uygun yuva kullanın; hücreye doğrudan lehim yapmak yerine bağlantıyı yuva üzerinden kurun.",
      },
      {
        title: "Hücreyi kontrol edin",
        text: "Hasarlı kılıfı olan, şişmiş veya anormal ısınan hücreyi kullanmayın. Koruma devresi bulunması, yanlış şarj cihazını veya hatalı bağlantıyı güvenli hâle getirmez.",
      },
    ],
    fact: { label: "Depolanan enerji", value: "Kimyasal enerji" },
    accent: "#71ba91",
  },
  reg: {
    category: "Besleme düzenleme",
    tagline: "Değişen pil geriliminden uygun bir besleme üretir.",
    overview: [
      {
        title: "Her parçanın ihtiyacı farklı",
        text: "Pil gerilimi kullanım boyunca değişir. Düzenleyici, bu değişime rağmen uygun çalışma aralığında kararlı bir çıkış sağlamayı amaçlar; motor beslemesi ayrıca değerlendirilir.",
      },
      {
        title: "Örnek tasarım seçenekleri",
        text: "Yaklaşık 3,0–4,2 V pil aralığından 5 V için bu aralığı destekleyen boost seçilebilir. Sabit 3,3 V için hem yükseltebilen hem düşürebilen buck-boost gerekir; kartın kabul ettiği giriş ayrıca doğrulanır.",
      },
    ],
    physics: [
      {
        title: "Gerilim artar, enerji artmaz",
        text: "Yükseltici enerji üretmez. Kayıplar da hesaba katıldığında çıkış gücü giriş gücünden küçüktür; gerilim yükseltilirken aynı güç için gereken giriş akımı artabilir.",
      },
      {
        title: "Anahtarlayarak dönüşüm",
        text: "DC-DC devreleri akımı hızlı biçimde anahtarlar; bobin ve kondansatör gibi elemanlarla enerjiyi aktarır. Kontrol devresi anahtarlamayı ayarlayarak çıkış gerilimini düzenler.",
      },
    ],
    safety: [
      {
        title: "Önce çıkışı ölçün",
        text: "Ayarlanabilir modülün çıkışını yükü bağlamadan önce ölçün. Geliştirme kartının 5 V girişi ile ESP32’nin 3V3 hattı aynı bağlantı değildir.",
      },
      {
        title: "Akım ve pil sınırı",
        text: "Dönüştürücünün giriş aralığı, akım kapasitesi ve düşük pil davranışı doğrulanmalıdır. Motorun kalkış veya sıkışma akımı, normal çalışmasındaki akımdan daha yüksek olabilir.",
      },
    ],
    fact: {
      label: "Örnek pil aralığı",
      value: "3,0–4,2 V → uygun sabit besleme",
    },
    accent: "#dfa365",
  },
  sensor: {
    category: "Elektriksel ölçüm",
    tagline: "Enerji akışını görünür sayılara dönüştürür.",
    overview: [
      {
        title: "Hangi kol ölçülüyor?",
        text: "Sensörün devredeki yeri, ölçümün neyi temsil ettiğini belirler. Motor kolundaki akım ile tüm sistemin akımı aynı şey değildir; sunumda ölçüm noktası açıkça belirtilmelidir.",
      },
      {
        title: "Ölçümden ekrana",
        text: "INA219 verileri I²C üzerinden ESP32’ye iletilir. ESP32 bu değerleri işleyip birimleriyle OLED ekrana yazabilir.",
      },
    ],
    physics: [
      {
        title: "Ohm yasasıyla akım",
        text: "Bilinen küçük bir şönt direncinin uçları arasındaki gerilim farkı ölçülür. I = U / R bağıntısı kullanılarak bu dirençten geçen akım hesaplanır.",
      },
      {
        title: "Gücü hesaplamak",
        text: "Aynı çalışma anındaki gerilim ve akımdan P = U × I bulunur. Güç, enerji aktarımının hızıdır; farklı zamanlardaki güç ölçümleri enerji tüketimini incelemeye yardımcı olur.",
      },
    ],
    safety: [
      {
        title: "Ölçüm yolunu doğrulayın",
        text: "Şönt bağlantısının yönü, kartın ölçebildiği gerilim ve akım aralığı ürün belgelerine göre seçilmelidir. Şönt akım yolu ile veri bağlantıları farklı görevler üstlenir.",
      },
      {
        title: "Mantık seviyeleri uyumlu olsun",
        text: "ESP32 ile veri alışverişinde 3,3 V I²C seviyeleri ve uygun ortak referans doğrulanmalıdır. Modül üzerindeki pull-up dirençlerinin hangi gerilime bağlı olduğu da önemlidir.",
      },
    ],
    fact: { label: "Ölçümün temel bağıntısı", value: "I = U / R" },
    accent: "#6aafc1",
  },
  esp: {
    category: "Veri işleme",
    tagline: "Ölçümleri okuyup anlaşılır bilgiye çevirir.",
    overview: [
      {
        title: "Projenin işlem merkezi",
        text: "Program, sensör verisini belirli aralıklarla okur, gerekli hesapları yapar ve ekranı günceller. Bu maketteki animasyon ise tarayıcıda çalışır; gerçek karta komut göndermez.",
      },
      {
        title: "Ortak veri yolu",
        text: "I²C, birden fazla uyumlu aygıtın aynı saat ve veri hatlarını paylaşabilmesini sağlar. Sensör ile ekranın adresleri ve bağlantı koşulları seçilen modüllerle doğrulanır.",
      },
    ],
    physics: [
      {
        title: "Analog dünya, sayısal veri",
        text: "Gerilim ve akım fiziksel büyüklüklerdir; sensör bunları sayısal değerlere dönüştürür. Program bu değerleri birimleriyle yorumladığında deneyin sonucu okunabilir hâle gelir.",
      },
      {
        title: "Örnekleme ve değişim",
        text: "Akım, motorun kalkışı sırasında hızla değişebilir. Ölçüm ve ekran yenileme aralığı çok uzunsa kısa değişimler görünmeyebilir; ekrandaki değer anlık davranışın tamamı değildir.",
      },
    ],
    safety: [
      {
        title: "GPIO bir motor beslemesi değildir",
        text: "GPIO uçları veri ve kontrol sinyalleri içindir. Gerçek motor kontrolü eklenecekse motor akımı uygun sürücü üzerinden yönetilir; sürücü ve koruma devresi ayrıca tasarlanır.",
      },
      {
        title: "Kart modelini tanıyın",
        text: "ESP32 geliştirme kartlarının besleme girişleri farklı olabilir. USB, 5 V ve 3V3 etiketlerini eşdeğer kabul etmeyin; besleme ve sinyal koşullarını kartın belgelerinden doğrulayın.",
      },
    ],
    fact: { label: "Verinin izlediği yol", value: "Sensör → program → ekran" },
    accent: "#a08cc4",
  },
  oled: {
    category: "Görsel geri bildirim",
    tagline: "Deneyin elektriksel sonuçları tek bakışta okunur.",
    overview: [
      {
        title: "Küçük bir ölçüm paneli",
        text: "Gerilim, akım ve hesaplanan güç, uygun birimleriyle gösterilebilir. Değerin hangi kola ait olduğunu yazmak, sunum sırasında ölçümün doğru anlaşılmasını sağlar.",
      },
      {
        title: "Maket ile gerçek veri",
        text: "Bu 3D modeldeki ekran örnek bir gösterimdir. Gerçek projede görünen sayıların sensörden mi geldiği, hesaplandığı mı yoksa örnek olduğu mu açıkça belirtilmelidir.",
      },
    ],
    physics: [
      {
        title: "Piksel kendi ışığını üretir",
        text: "OLED’de elektrik enerjisi, ışık yayan organik katmanlarda ışığa dönüşür. Görüntü, ayrı ayrı kontrol edilen piksellerin birlikte çalışmasıyla oluşur.",
      },
      {
        title: "Sayı ile anlam arasındaki bağ",
        text: "Volt gerilimi, amper akımı, watt gücü ifade eder. Birim ve ölçüm noktası olmadan bir sayı, fiziksel deneyin sonucunu tek başına açıklamaz.",
      },
    ],
    safety: [
      {
        title: "Modülün koşullarını kontrol edin",
        text: "Aynı boyuttaki OLED modüllerin besleme ve I²C özellikleri farklı olabilir. ESP32 ile kullanımda hem besleme hem veri hattı seviyeleri doğrulanmalıdır.",
      },
      {
        title: "Yüzdeyi ölçümle karıştırmayın",
        text: "Yalnızca gerilim veya INA219 verisi kesin pil yüzdesi sağlamaz. Doluluk gösterilecekse kullanılan tahmin yöntemi ve sınırları belirtilmelidir.",
      },
    ],
    fact: { label: "Gösterim biçimi", value: "Ölçüm + birim + ölçüm noktası" },
    accent: "#69b9b1",
  },
  switch: {
    category: "Mekanik kontrol",
    tagline: "Motor kolunun devresini elle açıp kapatır.",
    overview: [
      {
        title: "Basit, görünür kontrol",
        text: "Anahtarın kapalı konumu iletken yolu tamamlar; açık konumu bu yolu keser. Makette gösterilen anahtarın görevi motor güç kolunu kontrol etmektir.",
      },
      {
        title: "Animasyondan farklı bir parça",
        text: "Ekrandaki başlat/durdur düğmesi yalnızca pervane animasyonunu yönetir. Gerçek anahtar fiziksel devrede çalışır; aralarında uzaktan kumanda bağlantısı yoktur.",
      },
    ],
    physics: [
      {
        title: "Devre tamamlanınca",
        text: "Bir kaynağa bağlı kapalı iletken yol, akımın dolaşmasına olanak verir. Yol açıldığında o koldaki sürekli akım kesilir; başka kolların durumu devre yapısına bağlıdır.",
      },
      {
        title: "Temas direnci",
        text: "Anahtarın temasları tamamen dirençsiz değildir. Temas direncinde ısıya dönüşen güç I²R ile artar; bu nedenle yüksek akımda küçük dirençler bile önem kazanır.",
      },
    ],
    safety: [
      {
        title: "Yükün akımına uygun seçin",
        text: "Anahtarın doğru akım için verilen gerilim ve akım sınırları motorla eşleştirilmelidir. Motorun kalkış ve sıkışma durumları da hesaba katılır.",
      },
      {
        title: "Bakım için pili ayırın",
        text: "Motor anahtarını kapatmak bütün sistemi enerjisiz bırakmayabilir. Bağlantıları değiştirirken veya mile müdahale ederken enerji kaynağını ayırın.",
      },
    ],
    fact: { label: "Temel işlev", value: "İletken yolu aç / kapat" },
    accent: "#d18a7b",
  },
  motor: {
    category: "Elektromanyetik hareket",
    tagline: "Akım ve manyetik alan, bobini dönmeye zorlar.",
    overview: [
      {
        title: "Hazır motor yerine görünür düzenek",
        text: "Bobin, sabit mıknatıslar, mil ve destekler aynı düzenekte gösterilir. Böylece elektromanyetik kuvvetin dönme hareketine nasıl dönüştüğü incelenebilir.",
      },
      {
        title: "Dönüşü sürdüren komütasyon",
        text: "Akımın bobinin konumuna uygun biçimde yönlendirilmesi gerekir. Tasarıma göre akım yönü değiştirilir veya uygun aralıkta kesilir; basit komütatör bu zamanlamaya hizmet eder.",
      },
    ],
    physics: [
      {
        title: "Akım taşıyan tele kuvvet",
        text: "Düz bir iletken manyetik alana dikse kuvvetin büyüklüğü F = B · I · L olur. Bobinin karşı kenarlarındaki kuvvetler bir kuvvet çifti oluşturarak döndürücü etki yaratabilir.",
      },
      {
        title: "Tork ve hizalanma",
        text: "Bobin düzlemine dik olan manyetik moment, dış alanla hizalanmaya çalışır. Tork bu iki yön arasındaki açıya bağlıdır: paralelde sıfır, dikte en büyüktür.",
      },
      {
        title: "Enerjinin paylaşıldığı yer",
        text: "Elektrik enerjisinin bir bölümü mekanik işe, bir bölümü telde ısıya dönüşür. Sürtünme ve pervanenin hava direnci de motorun karşılaması gereken yüklerdir.",
      },
    ],
    safety: [
      {
        title: "Önce yüksüz deneyin",
        text: "Milin elle serbestçe dönebildiğinden emin olup düzeneği akım sınırlı beslemeyle deneyin. Kilitlenen bobinde akım ve ısınma artabilir; uzun süre enerjili bırakmayın.",
      },
      {
        title: "Dönen parçaları sabitleyin",
        text: "Mıknatıslar, destekler ve pervane güvenli biçimde tutturulmalıdır. Tel sıyırma, bağlantı veya hizalama işlemlerinden önce enerji kaynağını ayırın.",
      },
    ],
    fact: { label: "Alana dik iletkende kuvvet", value: "F = B · I · L" },
    accent: "#e2a34f",
  },
  fan: {
    category: "Mekanik yük",
    tagline: "Milin dönüşünü görünür bir hava hareketine dönüştürür.",
    overview: [
      {
        title: "Motorun taşıdığı yük",
        text: "Pervane yalnızca görsel bir ek değildir; motorun karşılaması gereken yükü artırır. Bu nedenle önce motorun tek başına çalışması, ardından hafif pervaneyle davranışı incelenir.",
      },
      {
        title: "Dört kanat, dengeli yerleşim",
        text: "Kanatlar mil çevresinde eşit aralıklarla gösterilir. Gerçek pervanede kütlelerin dengeli dağılması ve merkeze doğru bağlanması titreşim açısından önemlidir.",
      },
    ],
    physics: [
      {
        title: "Dönmeye karşı eylemsizlik",
        text: "Kütle mil ekseninden uzaklaştıkça dönme eylemsizliği artar. Aynı tork altında dönme eylemsizliği büyük bir pervanenin hızını değiştirmek daha zordur.",
      },
      {
        title: "Havaya aktarılan enerji",
        text: "Kanatlar havaya kuvvet uygularken hava da kanatlara karşı kuvvet uygular. Motor, dönmeyi sürdürmek için bu direnç torkunu ve sürtünmeyi karşılamalıdır.",
      },
    ],
    safety: [
      {
        title: "Hafif ve yumuşak malzeme",
        text: "Eğitim maketinde küçük, hafif ve keskin kenarı olmayan kanatlar tercih edin. Pervaneyi mile sağlam bağlayın; dönme düzleminde yüz veya el bulunmasın.",
      },
      {
        title: "Durmadan dokunmayın",
        text: "Saç, kıyafet ve kabloları dönen kanatlardan uzak tutun. Denge veya bağlantı kontrolünden önce enerjiyi ayırıp pervanenin tamamen durmasını bekleyin.",
      },
    ],
    fact: {
      label: "Motorun karşılaştığı yük",
      value: "Eylemsizlik + hava direnci",
    },
    accent: "#74aec8",
  },
};
