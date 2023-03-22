// @ts-nocheck
/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateParagraph, generateText } from "lipsum-zh";
const prisma = new PrismaClient();

async function seed(account: string) {
  await de();
  const hashedPassword = await bcrypt.hash("123456789w", 10);

  await prisma.user.create({
    data: {
      nickname: "admin",
      account: "admin@naiquoy.com",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      nickname: "naiquoy2",
      account: "me2@naiquoy.com",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      role: "BUSINESS",
    },
  });

  const user = await prisma.user.create({
    data: {
      nickname: "naiquoy",
      account,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      role: "USER",
    },
  });

  const note = await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
      summary: "Hello, world!",
      isRecommend: true,
      status: "PRIVATE",
    },
  });

  await prisma.noteLike.create({
    data: {
      userId: user.id,
      noteId: note.id,
    },
  });

  const noteCommenct = await prisma.noteComment.create({
    data: {
      userId: user.id,
      noteId: note.id,
      body: "This is a comment",
    },
  });

  await prisma.noteCommentLike.create({
    data: {
      userId: user.id,
      noteCommentId: noteCommenct.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!Elit aute reprehenderit proident amet et occaecat dolore amet non. Ut cupidatat velit culpa laborum deserunt non est reprehenderit commodo Lorem ipsum excepteur culpa. Exercitation veniam irure non mollit ad labore. Anim cupidatat dolore proident do ut tempor sunt in.Sit ipsum laboris ut aliquip mollit ut nostrud labore do minim ullamco. Sint id enim minim aliqua tempor. Officia ullamco ut nulla excepteur aliquip. Ullamco ullamco et incididunt mollit. Lorem esse enim ex tempor voluptate pariatur ullamco commodo enim eiusmod adipisicing sint voluptate.Fugiat quis aute eu velit id amet occaecat sunt quis quis. Culpa fugiat labore magna irure et. Proident voluptate occaecat aute fugiat. Qui incididunt aliqua laborum esse. Quis fugiat velit qui laborum aliqua nostrud esse consectetur do. Mollit pariatur incididunt incididunt proident consectetur eiusmod ad laborum reprehenderit dolore elit aliquip. Proident elit velit consequat irure sunt fugiat aliqua exercitation.Veniam cillum magna proident aliquip in non in consequat officia sit ex est sunt ipsum. Esse sit sunt dolor sunt. Anim pariatur labore ad aliqua ea esse do veniam laborum. Enim ad sit dolore est ex aliquip.",
      userId: user.id,
      summary: "",
      isRecommend: true,
    },
  });

  for (let i = 0; i < 100; i++) {
    await prisma.note.create({
      data: {
        title: generateText(Math.ceil(Math.random() * 10 + 1)),
        body: generateParagraph(1000),
        userId: user.id,
        summary: "",
        isRecommend: true,
      },
    });
  }

  await prisma.banner.create({
    data: {
      name: "banner1",
      url: "https://img.naiquoy.com/banner/vid_1.mp4",
      order: 1,
      userId: user.id,
      link: "https://www.naiquoy.com",
      type: "VIDEO",
    },
  });

  await prisma.banner.create({
    data: {
      name: "banner1",
      url: "https://img.naiquoy.com/banner/vid_02.mp4",
      order: 2,
      userId: user.id,
      link: "https://preview.naiquoy.com",
      type: "VIDEO",
    },
  });

  await prisma.notice.create({
    data: {
      title: "This is a top notice",
      content: "This is a notice body",
      userId: user.id,
      isTop: true,
    },
  });

  for (let i = 0; i < 100; i++) {
    await prisma.notice.create({
      data: {
        title: generateText(Math.ceil(Math.random() * 10 + 1)),
        content: generateParagraph(1000),
        userId: user.id,
      },
    });
  }

  let towns = [
    {
      name: "吴兴美妆小镇",
      image: "https://img.naiquoy.com/town/1473745505.jpg",
    },
    {
      name: "余杭梦想小镇",
      image: "https://img.naiquoy.com/town/1473753391.jpg",
    },
    {
      name: "上城玉皇山南基金小镇",
      image: "https://img.naiquoy.com/town/1473757446.jpg",
    },
    {
      name: "江干丁兰智慧小镇",
      image: "https://img.naiquoy.com/town/1479806393798005715.jpg",
    },
    {
      name: "嘉善巧克力甜蜜小镇",
      image: "https://img.naiquoy.com/town/1479806758137092528.jpg",
    },
    {
      name: "西湖云栖小镇",
      image: "https://img.naiquoy.com/town/1482737286400069208.jpg",
    },
    {
      name: "诸暨袜艺小镇",
      image: "https://img.naiquoy.com/town/1483431641014067889.jpg",
    },
    {
      name: "武义温泉小镇",
      image: "https://img.naiquoy.com/town/1484202768499021656.png",
    },
    {
      name: "定海远洋渔业小镇",
      image: "https://img.naiquoy.com/town/1484204128876008774.jpg",
    },
    {
      name: "普陀沈家门渔港小镇",
      image: "https://img.naiquoy.com/town/1484538798411076836.jpg",
    },
    {
      name: "临安绿色小镇",
      image: "https://img.naiquoy.com/town/1484549027369063422.jpg",
    },
  ];
  const townabcdedffeafawfasfszdxfvsdfsedgvwergvwesfwe =
    await prisma.town.create({
      data: {
        name: "莲麻小镇",
        userId: user.id,
        image: "https://img.naiquoy.com/town/1484535550743069548.jpg",
        summary:
          "广州从化莲麻村坐落在广州版图的最北点，北接韶关市的新丰县，东临惠州市的龙门县，是广州的北大门。该村由客家人迁居而成，形成于清朝，因村内的莲麻树得名，历来以农耕为主",
        industry: "酒水",
        area: "100平方公里",
        location: "广州从化",
        investment: "100亿元",
        detail: [
          {
            title: "基本情况",
            content:
              " 酒鬼街是莲麻小镇的标志性建筑群落，区域内包括莲麻农产品交易中心、莲麻豆腐坊、莲麻头酒交易中心三大建筑，打造成及特色酒文化、历史文化街道、休闲农业观光于一体。莲麻小镇自古有酒文化传统。莲麻人爱自己酿酒，因地处流溪河源头，山泉清凉甘甜，酿出的酒入口醇正、绵甜爽滑。走在巷道酒铺随处可见，别具一格的构造，让每家店保持着自己的特色。莲麻村坐拥独特的地理位置，植被覆盖率达百分之九十，绿树环绕隔离了城市污染、噪音，形成天然的氧吧。徜徉林间，感受沁人心脾芬芳一簇簇鲜艳娇嫩的花朵，聚集在叶片下，四处都是春的景象。莲麻树，也称作山枣树、酸枣树，稀少而珍贵。它的干、叶、花、果，都能够为人类服务。村民们亲切地称莲麻树是：我们的村树，我们的神树。林间小路，池塘水边，入林深处，忘却生活烦忧，只管一路向前。休假的时候，到从化莲麻小镇走走，品品酒文化，大口呼吸新鲜饱满的氧分子，多么的惬意。     ",
          },
        ],
      },
    });
  let uniqueFlag = true;
  towns.forEach(async (town) => {
    let _town = await prisma.town.create({
      data: {
        name: town.name,
        image: town.image,
        userId: user.id,
        isRecommend: true,
        summary: generateParagraph(50),
        industry: generateText(2),
        // investment generate 10-1000 billions
        investment: Math.floor(Math.random() * 1000) + "亿元",
        // area generate 10-1000 square kilometers
        area: Math.floor(Math.random() * 1000) + "平方公里",
        location: generateText(Math.floor(Math.random() * 10)),
        // company generate random text
        company: generateText(Math.floor(Math.random() * 10)),
        detail: [
          {
            title: "基本情况",
            content: generateParagraph(
              Math.floor(Math.random() * 10 + 1) * 100
            ),
          },
          {
            title: "项目优势",
            content: generateParagraph(
              Math.floor(Math.random() * 10 + 1) * 100
            ),
          },
          {
            title: "项目进展",
            content: generateParagraph(
              Math.floor(Math.random() * 10 + 1) * 100
            ),
          },
          {
            title: "项目规划",
            content: generateParagraph(
              Math.floor(Math.random() * 10 + 1) * 100
            ),
          },
          {
            title: "发展目标",
            content: generateParagraph(
              Math.floor(Math.random() * 10 + 1) * 100
            ),
          },
          {
            title: "人文旅居",
            content: generateParagraph(
              Math.floor(Math.random() * 10 + 1) * 100
            ),
          },
        ],
      },
    });
    if (uniqueFlag) {
      await prisma.note.update({
        where: { id: note.id },
        data: {
          townId: _town.id,
        },
      });

      uniqueFlag = false;
    }
  });
  await prisma.activity.create({
    data: {
      name: "吴兴美妆小镇开业大典",
      content:
        "吴兴美妆小镇开业啦，欢迎大家来参加，我们会有各种各样的活动，欢迎大家来参加，门票限时优",
      type: "HD",
      townId: townabcdedffeafawfasfszdxfvsdfsedgvwergvwesfwe.id,
      ticket: {
        createMany: {
          data: new Array(200).fill({
            tN: "门票",
            tP: 10000,
          }),
        },
      },
    },
  });

  await prisma.activity.create({
    data: {
      name: "限时优惠购买活动",
      content:
        "限时优惠购买活动，欢迎大家来参加，我们会有各种各样的活动，欢迎大家来参加，门票限时优惠",
      type: "HD",
      ticket: {
        createMany: {
          data: new Array(200).fill({
            tN: "购买物品",
            tP: 29990000,
          }),
        },
      },
    },
  });

  await prisma.activity.create({
    data: {
      name: "上海环屿Arch度假民宿",
      content:
        "本民宿由纽约一级建筑事务所，世界大师设计，设计团队来自美国常春藤院校，均获国际设计奖项 普利兹克奖，斯特林奖，安德鲁马丁奖。",
      type: "MSKZ",
      ticket: {
        createMany: {
          data: new Array(200).fill({
            tN: "大床房",
            tP: 10000000,
          }),
        },
      },
      img: "https://img.naiquoy.com/jd/jd1.jpg",
      jj: "开业：2017\n客房数：128\n联系方式：021-68876566",
      ss: "停车场免费\n\n健身室\n\n会议厅收费\n\n送机服务免费\n\n行李寄存\n\n24小时前台\n\nKTV\n\n棋牌室\n\n洗衣房\n\n茶室\n\n商务中心\n\n烧烤\n\n机器人服务",
      fw: "入离时间\n入住时间： 14:00后\n退房时间： 12:00前\n儿童及加床\n欢迎携带儿童入住\n婴儿床及加床政策\n所有房型不提供婴儿床；不同房型加床政策不同，请以预订房型内政策为准\n年龄限制\n不允许18岁以下单独办理入住\n宠物\n不可携带宠物。\n早餐\n餐食形式：自助餐\n餐食价格：￥38/人\n预订提示\n订单需等酒店或供应商确认后生效，订单确认结果以携程短信、邮件或app通知为准。",
    },
  });

  await prisma.activity.create({
    data: {
      name: "上海瑞廷西郊S酒店",
      content: `上海瑞廷西郊S酒店地处虹桥枢纽区域，距离国家会展中心约4公里，距离蟠龙路地铁站17号线步行约1.5公里，出行便利。
        酒店拥有200平现代化多功能会议厅及80平小型会议室满足您的各种会议需求；洗熨烘干自助洗衣房，强身健体的健身房，中西自助式早餐，超大阅读会友书吧。高品质的客房产品设施加细致温馨的服务，营造一个“自然、静谧、温暖、朴实”的健康生活方式，24小时贴心服务及个性化需求服务，为中高端商旅人士打造理想的住宿体验。`,
      type: "XJJD",
      ticket: {
        createMany: {
          data: new Array(200).fill({
            tN: "大床房",
            tP: 51000000,
          }),
        },
      },
      img: "https://img.naiquoy.com/jd/jd2.jpg",
      jj: "开业：2017\n客房数：128\n联系方式：021-68876566",
      ss: "停车场免费\n\n健身室\n\n会议厅收费\n\n送机服务免费\n\n行李寄存\n\n24小时前台\n\nKTV\n\n棋牌室\n\n洗衣房\n\n茶室\n\n商务中心\n\n烧烤\n\n机器人服务",
      fw: "入离时间\n入住时间： 14:00后\n退房时间： 12:00前\n儿童及加床\n欢迎携带儿童入住\n婴儿床及加床政策\n所有房型不提供婴儿床；不同房型加床政策不同，请以预订房型内政策为准\n年龄限制\n不允许18岁以下单独办理入住\n宠物\n不可携带宠物。\n早餐\n餐食形式：自助餐\n餐食价格：￥38/人\n预订提示\n订单需等酒店或供应商确认后生效，订单确认结果以携程短信、邮件或app通知为准。",
      location: "中国，上海，青浦区，徐泾镇双联路88号",
    },
  });

  await prisma.activity.create({
    data: {
      name: "上海桃花溪民宿",
      content: `这里是我精心准备的家。有缘来住下的朋友，希望它能为你带来一段温馨难忘的旅途体验。`,
      type: "MSKZ",
      ticket: {
        createMany: {
          data: new Array(200).fill({
            tN: "大床房",
            tP: 51000000,
          }),
        },
      },
      img: "https://img.naiquoy.com/jd/jd3.jpg",
      jj: "开业：2017\n客房数：128\n联系方式：021-68876566",
      ss: "停车场免费\n\n健身室\n\n会议厅收费\n\n送机服务免费\n\n行李寄存\n\n24小时前台\n\nKTV\n\n棋牌室\n\n洗衣房\n\n茶室\n\n商务中心\n\n烧烤\n\n机器人服务",
      fw: "入离时间\n入住时间： 14:00后\n退房时间： 12:00前\n儿童及加床\n欢迎携带儿童入住\n婴儿床及加床政策\n所有房型不提供婴儿床；不同房型加床政策不同，请以预订房型内政策为准\n年龄限制\n不允许18岁以下单独办理入住\n宠物\n不可携带宠物。\n早餐\n餐食形式：自助餐\n餐食价格：￥38/人\n预订提示\n订单需等酒店或供应商确认后生效，订单确认结果以携程短信、邮件或app通知为准。",
      location: "中国，上海，青浦区，徐泾镇双联路88号",
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

async function de() {
  prisma.user.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });
  prisma.note.deleteMany({}).catch(() => {});
  prisma.town.deleteMany({}).catch(() => {});
  prisma.banner.deleteMany({}).catch(() => {});
  prisma.activity.deleteMany({}).catch(() => {});
  prisma.ticket.deleteMany({}).catch(() => {});
  prisma.notice.deleteMany({}).catch(() => {});

  return null;
}

seed("me@naiquoy.com")
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
