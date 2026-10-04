import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEWS_DATA_PATH = path.join(__dirname, "../src/data/newsData.ts");

// Image and Video assets
const IMG_1 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1791121793/k-home-avenue/news/pho-thu-tuong-kiem-tra-san-bay-long-thanh-1.jpg";
const IMG_2 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1791121795/k-home-avenue/news/pho-thu-tuong-kiem-tra-san-bay-long-thanh-2.jpg";
const IMG_3 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1791121797/k-home-avenue/news/pho-thu-tuong-kiem-tra-san-bay-long-thanh-3.jpg";
const IMG_4 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1791121799/k-home-avenue/news/pho-thu-tuong-kiem-tra-san-bay-long-thanh-4.jpg";
const IMG_5 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1791121801/k-home-avenue/news/pho-thu-tuong-kiem-tra-san-bay-long-thanh-5.jpg";

const VIDEO_URL = "https://res.cloudinary.com/dthv0nsq/video/upload/v1791121805/k-home-avenue/news/video-pho-thu-tuong-kiem-tra-san-bay-long-thanh.mp4";

const SITE_IMG_1 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1788699472/k-home-avenue/image-maps-avenue/avenue-5.jpg";
const SITE_IMG_2 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1788699473/k-home-avenue/image-maps-avenue/avenue-6.jpg";
const SITE_IMG_3 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1788699474/k-home-avenue/image-maps-avenue/avenue-7.jpg";
const SITE_IMG_4 = "https://res.cloudinary.com/dthv0nsq/image/upload/v1788699475/k-home-avenue/image-maps-avenue/avenue-8.jpg";

const article1_content = `---VIDEO---${VIDEO_URL}|Video toàn cảnh: Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc kiểm tra đại công trường Sân bay Long Thành và các tuyến giao thông kết nối

![Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc kiểm tra nhà ga T1 Sân bay Long Thành](${IMG_1})

## 1. Toàn Cảnh Chuyến Kiểm Tra Thực Tế Của Phó Thủ Tướng Thường Trực Phạm Gia Túc Ngày 4-10

Sáng ngày 4-10, đoàn công tác cấp cao của Chính phủ do đồng chí **Phạm Gia Túc**, Ủy viên Bộ Chính trị, **Phó Thủ tướng Thường trực Chính phủ** làm trưởng đoàn đã trực tiếp đến kiểm tra hiện trường thi công Dự án Cảng hàng không quốc tế (sân bay) Long Thành cùng hệ thống các tuyến hạ tầng giao thông kết nối huyết mạch trên địa bàn tỉnh Đồng Nai. Tham gia đoàn công tác về phía địa phương có đồng chí **Hồ Văn Hà**, Thành ủy viên, Phó Chủ tịch UBND thành phố Đồng Nai, cùng đại diện lãnh đạo các sở, ban, ngành, Tổng công ty Cảng hàng không Việt Nam (ACV), Ban Quản lý dự án sân bay Long Thành và các nhà thầu thi công trọng điểm.

Chuyến công tác diễn ra trong thời điểm dự án đại công trình thế kỷ đang bước vào giai đoạn tăng tốc then chốt, quyết định việc hoàn thành các mốc tiến độ phục vụ vận hành kỹ thuật và đưa vào khai thác thương mại giai đoạn 1. Tại hiện trường, Phó Thủ tướng Thường trực Phạm Gia Túc cùng các thành viên đoàn công tác đã trực tiếp thị sát nhà ga hành khách trung tâm (gói thầu 5.10), khu vực đường cất hạ cánh số 1, hệ thống đường lăn, sân đỗ tàu bay, đài kiểm soát không lưu cũng như các tuyến giao thông đối ngoại kết nối T1, T2 và đại lộ huyết mạch Nguyễn Ái Quốc (đường 25C).

![Đoàn công tác Chính phủ và lãnh đạo Đồng Nai khảo sát tiến độ Sân bay Long Thành](${IMG_2})

Báo cáo trước Phó Thủ tướng Thường trực, lãnh đạo ACV và các đơn vị thi công cho biết trên toàn bộ công trường hiện có hơn 6.000 cán bộ, kỹ sư, công nhân cùng gần 3.000 thiết bị cơ giới đang làm việc ngày đêm theo chế độ "3 ca, 4 kíp", xuyên lễ, xuyên Tết. Tiến độ các gói thầu chính đều bám sát và vượt kế hoạch đề ra. Phó Thủ tướng Thường trực Phạm Gia Túc biểu dương tinh thần làm việc không quản ngày đêm của hàng ngàn người lao động, đồng thời nhấn mạnh: Sân bay quốc tế Long Thành là công trình trọng điểm quốc gia có ý nghĩa chiến lược đặc biệt đối với sự phát triển kinh tế - xã hội của cả nước nói chung và vùng Đông Nam Bộ nói riêng. Mọi khó khăn, vướng mắc phải được tháo gỡ kịp thời tại chỗ, không để xảy ra bất kỳ sự chậm trễ nào ảnh hưởng đến kế hoạch chung của đất nước.

---

## 2. Tiến Độ Chi Tiết Các Hạng Mục Trọng Điểm: Nhà Ga Hoa Sen, Đường Băng Số 1 Và Tháp Không Lưu

Trong khuôn khổ chuyến kiểm tra, đoàn công tác đã dành nhiều thời gian khảo sát kỹ lưỡng các gói thầu then chốt cấu thành sân bay:

### 2.1. Nhà ga hành khách hoa sen (Gói thầu 5.10)
Gói thầu trị giá hơn 35.000 tỷ đồng do liên danh nhà thầu quốc tế VIETUR thi công hiện là trái tim của dự án. Đến nay, toàn bộ kết cấu bê tông cốt thép của 4 tầng nổi đã hoàn thành 100%, vượt tiến độ so với kế hoạch ban đầu hơn 20 ngày. Các mũi thi công đang tập trung cao độ lắp dựng kết cấu vì kèo thép không gian mái với khẩu độ lớn và lắp đặt hệ thống vách kính mặt dựng chịu lực cao cấp.

![Phó Thủ tướng Thường trực kiểm tra kết cấu vòm hoa sen nhà ga Long Thành](${IMG_3})

Hệ mái vòm được thiết kế cách điệu hình hoa sen thanh thoát đang dần thành hình rõ nét trên đại công trường. Phó Thủ tướng Thường trực yêu cầu các đơn vị thi công phải chú trọng tuyệt đối đến chất lượng vật liệu, tính thẩm mỹ kiến trúc và quy chuẩn an toàn lao động, đảm bảo công trình khi hoàn thành không chỉ là một cảng hàng không hiện đại bậc nhất khu vực mà còn là một biểu tượng kiến trúc đáng tự hào của Việt Nam trên trường quốc tế.

### 2.2. Khu bay và đường cất hạ cánh số 1 (Gói thầu 4.6)
Đường cất hạ cánh số 1 dài 4.000m, rộng 45m cùng hệ thống đường lăn song song và đường lăn nối đã hoàn thành toàn bộ phần nền móng, móng cấp phối đá dăm và đang tích cực rải lớp bê tông xi măng mặt đường. Theo tính toán của các kỹ sư trưởng, hạng mục này sẽ hoàn thành thử nghiệm và hiệu chuẩn kỹ thuật sớm hơn từ 2 đến 3 tháng so với tiến độ được phê duyệt.

![Đoàn công tác Chính phủ kiểm tra đường cất hạ cánh và khu bay Sân bay Long Thành](${IMG_4})

### 2.3. Đài kiểm soát không lưu và các công trình quản lý bay
Đài kiểm soát không lưu cao 123m được ví như "mắt thần" của sân bay hiện đã cất nóc phần thô bê tông cốt thép và đang khẩn trương lắp đặt cabin đài chỉ huy cùng hệ thống thiết bị radar, thông tin dẫn đường vô tuyến hàng không tối tân do Tổng công ty Quản lý bay Việt Nam (VATM) làm chủ đầu tư.

---

## 3. Mạng Lưới Giao Thông Kết Nối T1, T2, Đại Lộ 25C Và Vành Đai 3: Mạch Máu Kinh Tế Đột Phá

Bên cạnh khu vực lõi cảng hàng không, Phó Thủ tướng Thường trực Phạm Gia Túc đặc biệt chỉ đạo kiểm tra thực địa công tác thi công các tuyến hạ tầng giao thông kết nối liên vùng – yếu tố then chốt quyết định khả năng thông thoát và năng lực phục vụ của sân bay khi đi vào vận hành.

![Lãnh đạo địa phương báo cáo phương án kết nối giao thông T1, T2 và đại lộ 25C](${IMG_5})

### Tuyến kết nối số 1 (T1) và tuyến số 2 (T2)
* **Tuyến T1:** Dài 4,3 km nối trực tiếp từ Quốc lộ 51 vào cổng chính sân bay Long Thành, quy mô 6 làn xe chính và 2 làn song hành. Tuyến đường này hiện đã đạt trên 85% khối lượng đắp nền và thảm nhựa mặt đường các đoạn nút giao.
* **Tuyến T2:** Dài 3,5 km nối song song từ cao tốc TP.HCM – Long Thành – Dầu Giây vào tuyến T1, tạo nên luồng giao thông tốc độ cao thông suốt từ trung tâm TP.HCM về sân bay chỉ mất 25 phút.

### Trục đại lộ Nguyễn Ái Quốc (Đường 25C) – Cửa ngõ chiến lược của Nhơn Trạch
Đặc biệt, trong quy hoạch tổng thể hạ tầng phụ trợ, tuyến đường **Nguyễn Ái Quốc (đường 25C)** với lộ giới lên tới **100 mét** là trục xương sống giao thông hướng tâm trực tiếp từ huyện Nhơn Trạch kết nối thẳng vào cổng phía Tây Sân bay quốc tế Long Thành. 

Báo cáo trước Phó Thủ tướng Thường trực, lãnh đạo tỉnh Đồng Nai cho biết các phân đoạn mở rộng của đường 25C đang được tập trung giải phóng mặt bằng và thi công hoàn thiện với tiến độ khẩn trương nhất. Khi tuyến đường 25C thông xe đồng bộ cùng nút giao cao tốc Biên Hòa – Vũng Tàu và tuyến Vành đai 3 TP.HCM (với cầu Nhơn Trạch dự kiến thông xe kỹ thuật), toàn bộ hành lang công nghiệp và đô thị Nhơn Trạch sẽ kết nối vào Sân bay Long Thành chỉ trong vòng **10 đến 12 phút di chuyển**.

| Tuyến giao thông kết nối trọng điểm | Quy mô & Lộ giới | Điểm kết nối | Thời gian kết nối đến Sân bay |
|---|---|---|---|
| **Đại lộ 25C (Nguyễn Ái Quốc)** | Rộng **100m** (8-10 làn xe) | Trung tâm Nhơn Trạch ➔ Cổng sân bay Long Thành | **10 – 12 phút** |
| **Tuyến giao thông T1** | 6 làn xe chính + 2 làn gom | Quốc lộ 51 ➔ Sân bay | 5 – 7 phút |
| **Tuyến giao thông T2** | Tuyến cao tốc nhánh | Cao tốc TP.HCM - Long Thành ➔ Tuyến T1 | 5 phút |
| **Đường Vành Đai 3 TP.HCM & Cầu Nhơn Trạch** | Cao tốc đô thị loại A | TP. Thủ Đức ➔ Nhơn Trạch | 15 – 20 phút |
| **Cao tốc Bến Lức – Long Thành** | 4 làn cao tốc hoàn chỉnh | Miền Tây ➔ Nhơn Trạch ➔ Sân bay Long Thành | 20 – 30 phút |

---

## 4. K-Home Avenue Nhơn Trạch: Hạt Nhân Hưởng Lợi Trực Tiếp Từ Trục Kết Nối Đại Lộ 25C Đến Sân Bay Long Thành

Sự chỉ đạo quyết liệt của Phó Thủ tướng Thường trực Phạm Gia Túc cùng tiến độ bứt phá của Sân bay Long Thành và đại lộ 25C đã mang đến xung lực phát triển chưa từng có cho dự án [nhà ở xã hội Nhơn Trạch](/k-home-avenue-nhon-trach) mang tên **K-Home Avenue** do Kim Oanh Land đầu tư phát triển.

### Vị trí "vàng" hiếm có tại mặt tiền đường 25C
Dự án K-Home Avenue tọa lạc kiêu hãnh ngay mặt tiền đại lộ Nguyễn Ái Quốc (đường 25C), xã Phước An, huyện Nhơn Trạch. Đây là dự án căn hộ chuẩn Singapore quy mô lớn bậc nhất nằm trên trục đường hướng thẳng vào cổng số 1 sân bay Long Thành:
* Cư dân K-Home Avenue chỉ cần chạy thẳng theo một đường duy nhất trên đại lộ 25C là có thể tiếp cận nhà ga hành khách sân bay Long Thành trong chưa đầy **10 phút**.
* Dự án nằm liền kề phân khu **Khu thương mại tự do thế hệ mới quy mô 1.000 ha** đang được tỉnh Đồng Nai hoàn tất đề án trình Chính phủ, nơi sẽ quy tụ hàng loạt trung tâm logistics quốc tế, kho ngoại quan và chuỗi cung ứng công nghệ cao.
* Kết nối nhanh chóng với mạng lưới 9 khu công nghiệp sầm uất của Nhơn Trạch (KCN 1-6, KCN Dệt may, KCN Ông Kèo) và cảng biển nước sâu Phước An chỉ từ 5 – 10 phút.

Khách hàng quan tâm đến chuỗi dự án nhà ở xã hội đồng bộ của Kim Oanh Land trên địa bàn Đồng Nai cũng có thể tham khảo thêm thông tin về [nhà ở xã hội Biên Hòa](/k-home-cityview-ho-nai) tại trung tâm Hố Nai và [nhà ở xã hội Trảng Bom](/k-home-midtown-trang-bom) tại ngã 4 đường 30/4 để có cái nhìn toàn diện về mạng lưới an cư vệ tinh.

---

## 5. Làn Sóng An Cư Đón Đầu 14.000 Chuyên Gia Hàng Không & Người Lao Động Đô Thị Sân Bay

Theo số liệu quy hoạch nhân sự từ Cục Hàng không Việt Nam và Tổng công ty Cảng hàng không Việt Nam (ACV), khi giai đoạn 1 của Sân bay quốc tế Long Thành chính thức vận hành với công suất 25 triệu lượt hành khách và 1,2 triệu tấn hàng hóa mỗi năm, sân bay sẽ cần bộ máy vận hành khổng lồ với hơn **14.000 cán bộ, nhân viên thường trực**:
1. Đội ngũ phi công, tiếp viên hàng không của các hãng bay nội địa và quốc tế.
2. Cán bộ điều hành bay, kỹ sư bảo dưỡng kỹ thuật máy bay (MRO), nhân viên radar không lưu.
3. Lực lượng an ninh hàng không, hải quan, kiểm dịch quốc tế, công an cửa khẩu.
4. Nhân sự vận hành dịch vụ mặt đất, logistics hàng hóa, suất ăn hàng không và nhân viên thương mại miễn thuế.

Đi kèm với lực lượng nhân sự chất lượng cao này là nhu cầu khổng lồ về **nhà ở đạt chuẩn, văn minh, tiện nghi và có khoảng cách di chuyển dưới 15 phút** tới sân bay. Trong khi khu vực xung quanh sân bay phần lớn là đất nông nghiệp và đất quy hoạch phụ trợ hàng không chưa có nhiều khu dân cư khép kín, tổ hợp [K-Home Avenue Nhơn Trạch](/k-home-avenue-nhon-trach) với **1.022 căn hộ chuẩn Singapore** hiện đại chính là lời giải hoàn hảo nhất cho bài toán an cư:
* **Môi trường sống sinh thái chuẩn quốc tế:** Dự án áp dụng tiêu chuẩn công trình xanh **EDGE (IFC - World Bank)**, giúp giảm 20% điện năng và 20% nước sinh hoạt, đảm bảo không gian sống trong lành, yên tĩnh và tiết kiệm chi phí vận hành hàng tháng.
* **Hệ tiện ích đa lớp nghỉ dưỡng:** Hồ bơi phong cách resort, công viên cây xanh, khu vui chơi trẻ em, sân thể thao ngoài trời, phòng sinh hoạt cộng đồng, trạm sạc xe điện thông minh và 82 căn shophouse phục vụ cà phê, nhà hàng, siêu thị mini ngay dưới chân nhà.
* **Quản lý vận hành thông minh K-City:** Kiểm soát ra vào thẻ từ đa tầng, camera AI giám sát 24/7 và ứng dụng quản lý cư dân hiện đại – đáp ứng tiêu chuẩn khắt khe về an ninh của nhân sự ngành hàng không.

---

## 6. Bài Toán Kinh Tế & Tiềm Năng Tăng Trưởng Vượt Bậc Của Dự Án K-Home Avenue

Không chỉ là chốn an cư lý tưởng cho người lao động và kỹ sư hàng không, K-Home Avenue còn mở ra cơ hội sở hữu bất động sản với giá trị thực vững chắc:

### Mức giá trong tầm tay người lao động
Được sự hỗ trợ tối đa từ chính sách an sinh của Chính phủ và cơ chế kiểm soát giá khắt khe của Sở Xây dựng tỉnh Đồng Nai, căn hộ K-Home Avenue có mức giá niêm yết chỉ từ **750 triệu đến 1,4 tỷ đồng/căn** (đã bao gồm VAT và bàn giao nội thất hoàn thiện).

### Gói vay ưu đãi 5,4%/năm – Trả góp nhẹ nhàng hơn tiền thuê nhà
Người mua nhà ở xã hội K-Home Avenue được Ngân hàng Chính sách Xã hội bảo lãnh gói tín dụng ưu đãi:
* **Hạn mức tài trợ:** Vay tối đa **80%** giá trị căn hộ.
* **Lãi suất ưu đãi:** Cố định **5,4%/năm** trong thời hạn vay tối đa **25 năm (300 tháng)**.
* **Số tiền thanh toán mỗi tháng:** Chỉ từ **2,5 – 3,5 triệu đồng/tháng** đối với căn Studio và từ **4,5 – 5,5 triệu đồng/tháng** đối với căn 2 phòng ngủ. Con số này hoàn toàn tương đương, thậm chí rẻ hơn chi phí thuê một phòng trọ gia đình chật hẹp tại khu vực Nhơn Trạch.

Quý khách hàng có thể chủ động kiểm tra tiến độ dòng tiền và kế hoạch trả nợ của gia đình tại [Bảng tính trả góp gói vay 5,4%](/tinh-tra-gop).

---

## 7. Tổng Hợp Câu Hỏi Thường Gặp (FAQ) Về Tiến Độ Sân Bay Long Thành & K-Home Avenue

### Q1: Chuyến kiểm tra ngày 4-10 của Phó Thủ tướng Thường trực Phạm Gia Túc nhấn mạnh mốc thời gian nào của Sân bay Long Thành?
> **Trả lời:** Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc chỉ đạo các chủ đầu tư, tổng thầu và địa phương phải giữ vững tiến độ thi công "3 ca, 4 kíp", đảm bảo mục tiêu đón chuyến bay kỹ thuật đầu tiên và hoàn thành đưa vào khai thác thương mại Giai đoạn 1 của Sân bay Quốc tế Long Thành theo đúng kế hoạch của Quốc hội và Chính phủ trong năm 2026.

### Q2: Từ dự án K-Home Avenue đi đến cổng Sân bay Long Thành mất bao nhiêu phút?
> **Trả lời:** K-Home Avenue nằm trực diện trên trục đại lộ Nguyễn Ái Quốc (đường 25C rộng 100m). Tuyến đường này kết nối thẳng vào cổng phía Tây của Cảng hàng không quốc tế Long Thành, do đó thời gian di chuyển bằng ô tô hoặc xe máy chỉ mất từ **10 đến 12 phút** trên tuyến đường thẳng tắp, không có đèn đỏ giao cắt phức tạp.

### Q3: Ai được quyền nộp hồ sơ mua căn hộ nhà ở xã hội K-Home Avenue?
> **Trả lời:** Theo Luật Nhà ở 2023, mọi công dân Việt Nam chưa sở hữu nhà ở tại tỉnh Đồng Nai, có thu nhập thực nhận sau thuế dưới 15 triệu đồng/tháng (đối với cá nhân độc thân) hoặc tổng thu nhập hai vợ chồng dưới 30 triệu đồng/tháng, có hợp đồng lao động và đóng bảo hiểm xã hội tại Đồng Nai từ 12 tháng trở lên đều đủ điều kiện nộp hồ sơ xét duyệt mua nhà.

### Q4: Thủ tục nộp hồ sơ mua K-Home Avenue có phức tạp không và có mất phí tư vấn không?
> **Trả lời:** Hoàn toàn không mất phí. Đội ngũ chuyên viên pháp lý của Kim Oanh Land hỗ trợ tư vấn, kiểm tra điều kiện VNeID, hoàn thiện hồ sơ biểu mẫu chuẩn và nộp thẩm định tại Sở Xây dựng hoàn toàn miễn phí 100%. Quý khách chỉ cần liên hệ trực tiếp qua Hotline chính thức **0937 587 438**.

---

> [!TIP]
> **Đăng Ký Nhận Bộ Tài Liệu Quy Hoạch & Hướng Dẫn Hồ Sơ NOXH K-Home Avenue:** Quý khách hàng, cán bộ công nhân viên và chuyên gia có nhu cầu tìm hiểu suất mua ưu đãi tại dự án K-Home Avenue đón đầu Sân bay Long Thành, vui lòng liên hệ trực tiếp Hotline: **0937 587 438** hoặc truy cập [Danh mục sản phẩm dự án](/san-pham) để được hỗ trợ chu đáo nhất!

---RELATED---tien-do-xay-dung-k-home-avenue-nhon-trach-moi-nhat-2026|Tiến Độ Xây Dựng K-Home Avenue Mới Nhất 2026;mua-nha-o-xa-hoi-nhon-trach-2026-cam-nang-phap-ly-dieu-kien-ho-so|Cẩm Nang Mua Nhà Ở Xã Hội Nhơn Trạch;bang-gia-m2-nha-o-xa-hoi-nhon-trach-2026-so-sanh-chi-phi|Bảng Giá m2 Nhà Ở Xã Hội Nhơn Trạch`;

const article2_content = `![Đại công trường thi công K-Home Avenue Nhơn Trạch tháng 10/2026](${SITE_IMG_1})

## 1. Tổng Quan Quy Mô Dự Án Nhà Ở Xã Hội K-Home Avenue Nhơn Trạch

Dự án **K-Home Avenue Nhơn Trạch** (khu nhà ở xã hội tại xã Phước An, huyện Nhơn Trạch, tỉnh Đồng Nai) do Công ty Cổ phần Đầu tư và Phát triển Bất động sản Miền Đông (thành viên Tập đoàn Kim Oanh - Kim Oanh Land) làm chủ đầu tư. Đây là dự án nhà ở xã hội kiểu mẫu tiên phong tại cửa ngõ khu Đông TP.HCM được phát triển theo tiêu chuẩn xanh bền vững **EDGE** của Tổ chức Tài chính Quốc tế (IFC - World Bank) và ngôn ngữ kiến trúc thông minh chuẩn Singapore.

Quần thể dự án sở hữu các thông số quy hoạch ấn tượng:
* **Tổng diện tích quỹ đất:** Hơn **5,3 ha** tọa lạc ngay mặt tiền đại lộ Nguyễn Ái Quốc (đường 25C rộng 100m).
* **Quy mô khối công trình:** Bao gồm **4 block căn hộ chung cư cao 12 tầng** (Block A1, Block A2, Block B1, Block B2).
* **Tổng số lượng sản phẩm:** Cung cấp **1.022 căn hộ nhà ở xã hội** hiện đại cùng **82 căn shophouse** thương mại dịch vụ tại khối đế.
* **Cơ cấu diện tích căn hộ đa dạng:**
  * Căn hộ Studio: Diện tích **37,7 m²** (tối ưu cho người độc thân, chuyên gia trẻ).
  * Căn hộ 1 Phòng ngủ +: Diện tích **46,6 m²** (phù hợp gia đình trẻ mới cưới).
  * Căn hộ 2 Phòng ngủ nhỏ (2PN-A): Diện tích **65,7 m²** (2 phòng ngủ, 1 nhà vệ sinh).
  * Căn hộ 2 Phòng ngủ lớn (2PN-B): Diện tích **69,5 m²** (2 phòng ngủ, 2 nhà vệ sinh, ban công riêng biệt).
* **Hệ sinh thái tiện ích nội khu:** Tích hợp đầy đủ hồ bơi phong cách resort, công viên trung tâm cây xanh, sân chơi trẻ em thông minh Smart Kids, khu tập thể dục ngoài trời, vườn nướng BBQ, nhà sinh hoạt cộng đồng đa năng, hệ thống trạm sạc xe điện thông minh và trường mầm non đạt chuẩn.

![Thi công ép cọc cừ larsen và kết cấu móng K-Home Avenue](${SITE_IMG_2})

---

## 2. Báo Cáo Tiến Độ Thực Địa Tháng 10/2026: Thi Công Đồng Loạt 4 Block A1, A2, B1, B2

Ghi nhận thực tế tại đại công trường K-Home Avenue Nhơn Trạch vào đầu tháng 10/2026, không khí thi công diễn ra vô cùng sôi động, khẩn trương và chuyên nghiệp. Hàng trăm kỹ sư, công nhân kỹ thuật cùng dàn máy ép cọc robot, cần cẩu tháp, xe bơm bê tông chuyên dụng đang hoạt động hết công suất dưới sự điều phối chặt chẽ của ban chỉ huy công trường.

### 2.1. Phân khu Block A1 & Block A2 (Mặt tiền đại lộ 25C)
* **Công tác ép cọc ly tâm D500 & D600:** Đã hoàn thành 100% khối lượng thi công cọc thử nghiệm và cọc đại trà, đạt chuẩn chịu tải trọng theo hồ sơ thiết kế kỹ thuật được Bộ Xây dựng thẩm duyệt.
* **Hạng mục đài móng và giằng móng:** Đang tiến hành lắp dựng ván khuôn thép, đan buộc lưới thép cường độ cao và đổ bê tông thương phẩm mác cao cho các phân đoạn đài móng chính. Khối lượng thi công đài giằng móng hiện đạt hơn 75%.
* **Hầm kỹ thuật và bể nước ngầm:** Đã hoàn tất công tác đào đất, gia cố cừ Larsen chắn đất chống sạt lở và đang khẩn trương thi công lớp bê tông lót đáy bể ngầm PCCC và bể xử lý nước thải sinh hoạt hiện đại.

### 2.2. Phân khu Block B1 & Block B2 (Phía công viên nội khu)
* **Khối lượng ép cọc:** Hoàn tất 90% số lượng tim cọc, đang tiến hành thử tải tĩnh cọc để phục vụ công tác nghiệm thu giai đoạn nền móng.
* **Hạ tầng thoát nước tạm:** Hệ thống mương dẫn dòng, rãnh thu nước mặt và trạm rửa xe tự động phục vụ công trường đã vận hành hoàn chỉnh, đảm bảo mặt bằng thi công luôn khô ráo, sạch sẽ và an toàn tuyệt đối trong mùa mưa Nam Bộ.

![Toàn cảnh phân khu 4 block căn hộ K-Home Avenue](${SITE_IMG_3})

### 2.3. Bảng tổng hợp tiến độ chi tiết từng phân khu (Tháng 10/2026)
| Hạng mục công trình | Khối lượng thực hiện | Đánh giá so với tiến độ cam kết | Dự kiến hoàn thành |
|---|---|---|---|
| **Ép cọc đại trà 4 Block** | Đạt **95%** toàn dự án | Vượt tiến độ 10 ngày | Tháng 10/2026 |
| **Đài móng & giằng hầm A1, A2** | Đạt **75%** khối lượng | Đúng tiến độ phê duyệt | Tháng 11/2026 |
| **Đài móng & giằng hầm B1, B2** | Đạt **60%** khối lượng | Đúng tiến độ phê duyệt | Tháng 11/2026 |
| **Bể nước ngầm PCCC & sinh hoạt**| Đạt **80%** phần thô bê tông | Đảm bảo yêu cầu kỹ thuật | Tháng 11/2026 |
| **Nghiệm thu phần móng toàn diện** | Đang chuẩn bị hồ sơ kiểm định | Đủ điều kiện ký HĐMB | Tháng 12/2026 |
| **Cất nóc 4 Block cao 12 tầng** | Chuẩn bị thi công kết cấu thân | Dự kiến quý 2/2027 | Tháng 06/2027 |
| **Hoàn thiện & Bàn giao nhà** | Hoàn thiện nội thất chuẩn Singapore | Cam kết từ chủ đầu tư | Quý 4/2027 – Q1/2028 |

---

## 3. Năng Lực Của Đội Ngũ Phát Triển, Tổng Thầu Thi Công Và Đơn Vị Tư Vấn Giám Sát

Một trong những yếu tố quan trọng nhất mang lại sự an tâm tuyệt đối cho khách hàng khi chọn mua [nhà ở xã hội Nhơn Trạch](/k-home-avenue-nhon-trach) tại K-Home Avenue chính là uy tín và năng lực vượt trội của các đối tác đồng hành:

1. **Chủ đầu tư Kim Oanh Land (Kim Oanh Group):** Doanh nghiệp bất động sản hàng đầu với hơn 20 năm kinh nghiệm phát triển các dự án nhà ở chất lượng cao tại miền Nam, được vinh danh trong Top 10 nhà phát triển nhà ở xã hội hàng đầu Việt Nam và giải thưởng quốc tế danh giá *PropertyGuru Vietnam Property Awards 2025*.
2. **Đơn vị tư vấn quy hoạch và kiến trúc:** **Global Vireon Studio** và **Cubic Architects** – những tên tuổi gắn liền với các công trình kiến trúc xanh hiện đại, mang đến giải pháp bố cục thông minh, 100% căn hộ đều có cửa sổ mở đón ánh sáng tự nhiên và thông gió đối lưu.
3. **Nhà thầu nền móng và xây dựng:** **Công ty Cổ phần Đầu tư Phan Vũ** – thương hiệu tiên phong số 1 Việt Nam về công nghệ cọc bê tông ly tâm dự ứng lực và thi công nền móng sâu, kết hợp cùng các đối tác xây dựng dày dạn kinh nghiệm.
4. **Tư vấn kết cấu và cơ điện (M&E):** **Handong Engineering** – tập đoàn kỹ thuật chuyên nghiệp ứng dụng công nghệ BIM (Building Information Modeling) trong việc quản lý và kiểm soát xung đột kỹ thuật công trình.
5. **Đơn vị tư vấn giám sát chất lượng:** **Công ty Cổ phần Tư vấn Công nghệ, Thiết bị và Kiểm định Xây dựng - CONINCO** – đơn vị kiểm định độc lập trực thuộc Bộ Xây dựng, chịu trách nhiệm túc trực 24/7 kiểm định nghiêm ngặt từng mẻ bê tông, thanh thép và chất lượng mối hàn trước khi nghiệm thu từng công đoạn.
6. **Đơn vị quản lý vận hành tòa nhà:** **K-City Property Management** – công ty vận hành chuyên nghiệp theo tiêu chuẩn dịch vụ Singapore, đảm bảo môi trường sống văn minh, an toàn và sạch đẹp lâu dài cho cộng đồng cư dân.

Bên cạnh K-Home Avenue, khách hàng tại khu vực Đồng Nai cũng có thể tìm hiểu thêm về tiến độ thi công của hai dự án cùng chuỗi thương hiệu K-Home: [nhà ở xã hội Biên Hòa](/k-home-cityview-ho-nai) quy mô 1.328 căn tại đường Điểu Xiển và [nhà ở xã hội Trảng Bom](/k-home-midtown-trang-bom) quy mô 542 căn tại trung tâm hành chính Trảng Bom.

---

## 4. Tiến Độ Hạ Tầng Giao Thông & Tiện Ích Đô Thị Bao Quanh Đường 25C

Tiến độ xây dựng vượt trội của K-Home Avenue Nhơn Trạch còn được cộng hưởng mạnh mẽ bởi sự bứt phá thần tốc của các công trình hạ tầng giao thông trọng điểm bao quanh dự án:

![Hạ tầng đường 25C Nguyễn Ái Quốc đối diện cổng dự án K-Home Avenue](${SITE_IMG_4})

### Đại lộ 25C (Nguyễn Ái Quốc) mở rộng 100m
Tuyến đường Nguyễn Ái Quốc (đường 25C) chạy trực diện trước cổng dự án K-Home Avenue đang được Ban Quản lý dự án đầu tư xây dựng công trình giao thông tỉnh Đồng Nai đẩy nhanh tiến độ thi công mở rộng toàn tuyến. Mặt đường được quy hoạch từ 8 đến 10 làn xe cơ giới kết hợp vỉa hè cây xanh rộng thoáng và dải phân cách hoa cảnh rực rỡ. Khi tuyến đường hoàn thành toàn bộ, cư dân chỉ mất đúng **10 phút** để lái xe từ K-Home Avenue vào nhà ga sân bay quốc tế Long Thành.

### Cầu Nhơn Trạch (Dự án thành phần 1A - Vành Đai 3 TP.HCM)
Cầu Nhơn Trạch nối liền giữa huyện Nhơn Trạch và TP. Thủ Đức (TP.HCM) với tổng mức đầu tư hơn 6.900 tỷ đồng hiện đã hoàn thành các trụ cầu chính giữa sông Đồng Nai và đang thi công lao dầm các nhịp đúc hẫng cân bằng. Theo cam kết từ Ban Quản lý dự án Mỹ Thuận, cây cầu chiến lược này sẽ chính thức thông xe kỹ thuật trong năm 2026, rút ngắn thời gian di chuyển từ K-Home Avenue sang trung tâm TP.HCM xuống chỉ còn **20 đến 25 phút**.

### Cao tốc Bến Lức – Long Thành
Đoạn tuyến cao tốc đi qua địa bàn Nhơn Trạch với nút giao thông khác mức kết nối vào đường 25C và đường 319 đã cơ bản hoàn thành thảm nhựa và lắp đặt dải phân cách cứng, mở ra luồng di chuyển thông suốt kết nối Nhơn Trạch với các tỉnh miền Tây Nam Bộ và hệ thống cảng nước sâu Cái Mép – Thị Vải.

---

## 5. Tiêu Chuẩn Công Trình Xanh EDGE & Giám Sát Chất Lượng Bàn Giao

K-Home Avenue Nhơn Trạch là một trong số ít dự án nhà ở xã hội tại Việt Nam đăng ký và đáp ứng trọn vẹn bộ tiêu chí khắt khe của chứng chỉ công trình xanh quốc tế **EDGE (Excellence in Design for Greater Efficiencies)** do Tổ chức Tài chính Quốc tế (IFC - thành viên World Bank) cấp:

* **Tiết kiệm điện năng tiêu thụ (≥ 20%):** Nhờ thiết kế khí động học thông minh, tỷ lệ diện tích cửa sổ đón gió tối ưu kết hợp cùng hệ thống sơn phản xạ nhiệt mặt dựng ngoài trời và 100% thiết bị chiếu sáng LED tiết kiệm năng lượng.
* **Tiết kiệm nước sinh hoạt (≥ 20%):** Trang bị thiết bị sen vòi, bồn cầu xả kép thế hệ mới có lưu lượng nước tiêu chuẩn, đồng thời tích hợp hệ thống thu gom và tái sử dụng nước tưới cảnh quan tự động.
* **Giảm thiểu năng lượng hàm chứa trong vật liệu (≥ 20%):** Ứng dụng gạch bê tông không nung thân thiện với môi trường, tấm sàn panel đúc sẵn công nghệ cao và vật liệu hoàn thiện không chứa hóa chất độc hại hữu cơ bay hơi (VOCs).

Nhờ tiêu chuẩn xanh EDGE, mỗi gia đình cư dân sinh sống tại K-Home Avenue sẽ tiết kiệm được từ **300.000 đến 600.000 đồng** chi phí hóa đơn điện nước sinh hoạt mỗi tháng – một khoản tiết kiệm rất ý nghĩa đối với người lao động có thu nhập trung bình.

---

## 6. Lộ Trình Tiến Độ Cam Kết & Kế Hoạch Bàn Giao Từ Kim Oanh Land

Chủ đầu tư Kim Oanh Land công bố công khai lộ trình pháp lý và các mốc tiến độ thi công của dự án K-Home Avenue nhằm đảm bảo quyền lợi tối cao cho người mua nhà:

* **Quý 1/2026:** Hoàn tất toàn diện quy hoạch chi tiết 1/500, báo cáo đánh giá tác động môi trường (ĐTM), thẩm duyệt thiết kế PCCC và cấp Giấy phép xây dựng hợp pháp.
* **Quý 2/2026 – Tháng 10/2026:** Khởi công xây dựng chính thức, hoàn thành toàn bộ công tác ép cọc thử tải, cọc đại trà và thi công hệ kết cấu móng giằng 4 block căn hộ.
* **Tháng 12/2026:** Hoàn tất nghiệm thu phần móng theo quy định của Luật Nhà ở và Luật Kinh doanh Bất động sản; Sở Xây dựng tỉnh Đồng Nai thông báo đủ điều kiện ký Hợp đồng mua bán chính thức.
* **Quý 1 – Quý 2/2027:** Thi công kết cấu bê tông cốt thép phần thân từ tầng 1 đến tầng 12; tổ chức lễ cất nóc toàn bộ 4 block tháp vào tháng 6/2027.
* **Quý 3 – Quý 4/2027:** Lắp đặt hệ thống cơ điện M&E, trạm biến áp, thang máy tốc độ cao, vách ngăn chống cháy, sơn bả hoàn thiện và lắp đặt nội thất bàn giao.
* **Quý 1/2028:** Nghiệm thu PCCC, nghiệm thu công trình đưa vào sử dụng của Cục Giám định Nhà nước (Bộ Xây dựng) và chính thức bàn giao chìa khóa căn hộ cho những cư dân đầu tiên.

---

## 7. Tiến Độ Tiếp Nhận Hồ Sơ Xét Duyệt NOXH & Quy Trình Giải Ngân Theo Tiến Độ

Song song với nhịp độ thi công tại công trường, bộ phận tiếp nhận hồ sơ xét duyệt [mua nhà ở xã hội Nhơn Trạch](/k-home-avenue-nhon-trach) tại Văn phòng tư vấn dự án K-Home Avenue đang tích cực hướng dẫn người dân hoàn thiện thủ tục:

### Quy trình 4 bước nộp hồ sơ chuẩn xác:
1. **Bước 1 - Tiếp nhận biểu mẫu:** Người mua liên hệ văn phòng dự án để nhận bộ biểu mẫu Mẫu 01, Mẫu 02 (xác nhận thực trạng nhà ở), Mẫu 04 (xác nhận thu nhập dưới 15 triệu/tháng).
2. **Bước 2 - Chuẩn bị giấy tờ nhân thân:** Căn cước công dân gắn chip, định danh VNeID mức 2, giấy đăng ký kết hôn (hoặc giấy xác nhận độc thân) và trích lục tham gia BHXH Đồng Nai từ 12 tháng trở lên qua VssID.
3. **Bước 3 - Nộp hồ sơ xét duyệt:** Hồ sơ được tập hợp và chuyển giao cho Hội đồng thẩm định Sở Xây dựng tỉnh Đồng Nai để tiến hành chấm điểm ưu tiên và rà soát điều kiện.
4. **Bước 4 - Ký hợp đồng và giải ngân:** Sau khi có thông báo đủ điều kiện mua, khách hàng ký HĐMB và được Ngân hàng Chính sách Xã hội giải ngân theo tiến độ thi công thực tế của dự án.

### Tiến độ đóng tiền chia nhỏ theo từng giai đoạn thi công:
* **Đợt 1:** Thanh toán **15%** khi ký Hợp đồng dịch vụ tư vấn / Hợp đồng mua bán.
* **Đợt 2 – 5:** Thanh toán **5% / đợt** (mỗi đợt cách nhau từ 30 – 45 ngày theo tiến độ đổ sàn bê tông).
* **Đợt ngân hàng giải ngân:** Gói vay ưu đãi 5,4% giải ngân tối đa **75% - 80%** giá trị hợp đồng theo tiến độ nghiệm thu của ngân hàng.
* **Đợt bàn giao:** Đóng 2% kinh phí bảo trì khi có thông báo nhận bàn giao nhà.

---

## 8. Câu Hỏi Thường Gặp (FAQ) Về Tiến Độ & Mua Nhà K-Home Avenue Nhơn Trạch

### Q1: Tiến độ thi công K-Home Avenue hiện tại có đang đúng cam kết không?
> **Trả lời:** Đúng. Dự án đang bám sát và vượt tiến độ thi công đề ra. Toàn bộ phần móng cọc của 4 block căn hộ cao 12 tầng đã hoàn thành trên 95% khối lượng, bảo đảm điều kiện nghiệm thu móng trong quý 4/2026 và cất nóc vào giữa năm 2027.

### Q2: Khách hàng có thể đến trực tiếp công trường để xem tiến độ xây dựng không?
> **Trả lời:** Hoàn toàn được. Chủ đầu tư Kim Oanh Land tổ chức các chuyến xe đưa đón khách hàng tham quan thực tế công trường và sa bàn dự án tại văn phòng Sales Gallery vào tất cả các ngày trong tuần. Quý khách vui lòng liên hệ trước qua Hotline **0937 587 438** để được đăng ký lịch tiếp đón và trang bị đồ bảo hộ an toàn lao động.

### Q3: Nếu ngân hàng giải ngân theo tiến độ thì tôi phải trả lãi và gốc từ khi nào?
> **Trả lời:** Ngân hàng Chính sách Xã hội chỉ giải ngân vốn theo khối lượng thi công thực tế của dự án được nghiệm thu. Tiền lãi và tiền gốc chỉ tính trên số tiền thực tế ngân hàng đã giải ngân, giúp giảm thiểu tối đa áp lực tài chính cho người mua nhà trong giai đoạn công trình đang xây dựng.

---

> [!TIP]
> **Đăng Ký Tham Quan Thực Địa & Nhận Bảng Báo Giá Chi Tiết K-Home Avenue:** Quý khách hàng muốn cập nhật hình ảnh thi công thực tế mới nhất hoặc cần chuyên viên hỗ trợ kiểm tra điều kiện hồ sơ xét duyệt NOXH hoàn toàn miễn phí, hãy liên hệ ngay Hotline: **0937 587 438** hoặc xem chi tiết tại [Danh mục dự án K-Home](/san-pham).

---RELATED---pho-thu-tuong-pham-gia-tuc-kiem-tra-san-bay-long-thanh-giao-thong-ket-noi-k-home-avenue|Phó Thủ Tướng Kiểm Tra Sân Bay Long Thành;mua-nha-o-xa-hoi-nhon-trach-2026-cam-nang-phap-ly-dieu-kien-ho-so|Cẩm Nang Mua Nhà Ở Xã Hội Nhơn Trạch;bang-gia-m2-nha-o-xa-hoi-nhon-trach-2026-so-sanh-chi-phi|Bảng Giá m2 Nhà Ở Xã Hội Nhơn Trạch`;

// Function to count Vietnamese words
function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const words1 = countWords(article1_content);
const words2 = countWords(article2_content);

console.log("Article 1 words:", words1);
console.log("Article 2 words:", words2);

if (words1 < 2000 || words2 < 2000) {
  console.error("❌ Word count below 2000!");
  process.exit(1);
}

const newArticles = [
  {
    id: "n250",
    slug: "pho-thu-tuong-pham-gia-tuc-kiem-tra-san-bay-long-thanh-giao-thong-ket-noi-k-home-avenue",
    title: "✈️ Phó Thủ Tướng Thường Trực Chính Phủ Phạm Gia Túc Kiểm Tra Dự Án Sân Bay Long Thành Và Các Tuyến Giao Thông Kết Nối: Đòn Bẩy Đột Phá Cho K-Home Avenue Nhơn Trạch",
    date: "2026-10-04",
    excerpt: "🏗️ Ngày 4-10, đoàn công tác của Chính phủ do đồng chí Phạm Gia Túc, Ủy viên Bộ Chính trị, Phó Thủ tướng Thường trực Chính phủ làm trưởng đoàn đã kiểm tra thực tế tiến độ thi công Dự án Cảng hàng không quốc tế (sân bay) Long Thành và các tuyến giao thông kết nối. Tiếp và tham gia đoàn công tác có Thành ủy viên, Phó Chủ tịch UBND thành phố Đồng Nai Hồ Văn Hà.",
    image: IMG_1,
    category: "Quy hoạch & Hạ tầng",
    project: "avenue",
    readTime: "12 phút đọc",
    content: article1_content
  },
  {
    id: "n251",
    slug: "tien-do-xay-dung-k-home-avenue-nhon-trach-moi-nhat-2026",
    title: "Tiến Độ Xây Dựng K-Home Avenue Nhơn Trạch Cập Nhật Mới Nhất Tháng 10/2026: Thi Công Thần Tốc 4 Block Chuẩn Singapore Cửa Ngõ Sân Bay Long Thành",
    date: "2026-10-04",
    excerpt: "Cập nhật thực tế tiến độ xây dựng dự án Nhà Ở Xã Hội K-Home Avenue Nhơn Trạch mới nhất tháng 10/2026: Hình ảnh công trường thi công 4 block căn hộ cao 12 tầng trên mặt tiền đường 25C, tiến độ pháp lý, mốc thời gian cất nóc và lộ trình bàn giao nhà chuẩn Singapore.",
    image: SITE_IMG_1,
    category: "Tiến độ thi công",
    project: "avenue",
    readTime: "11 phút đọc",
    content: article2_content
  }
];

// Read existing newsData.ts
let newsDataCode = fs.readFileSync(NEWS_DATA_PATH, "utf-8");

// Check if already inserted
if (newsDataCode.includes("pho-thu-tuong-pham-gia-tuc-kiem-tra-san-bay-long-thanh-giao-thong-ket-noi-k-home-avenue")) {
  console.log("Articles already exist in newsData.ts. Updating...");
  // Will handle if needed
} else {
  // Insert at the beginning of the newsData array
  // Find "export const newsData: News[] = ["
  const targetStr = "export const newsData: News[] = [";
  const insertIndex = newsDataCode.indexOf(targetStr);
  if (insertIndex === -1) {
    console.error("Could not find newsData declaration!");
    process.exit(1);
  }

  const articlesJson = JSON.stringify(newArticles, null, 2);
  // Strip leading "[" and trailing "]"
  const innerJson = articlesJson.trim().slice(1, -1).trim();

  const updatedCode = newsDataCode.slice(0, insertIndex + targetStr.length) +
    "\n" + innerJson + "," +
    newsDataCode.slice(insertIndex + targetStr.length);

  fs.writeFileSync(NEWS_DATA_PATH, updatedCode, "utf-8");
  console.log("✅ Successfully inserted 2 articles into src/data/newsData.ts");
}
