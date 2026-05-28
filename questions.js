const questions = [
  {
    id: 1,
    title: "到达目的地的第一天下午",
    description: "经过长途旅行，你们终于到达目的地，现在是下午2点",
    options: [
      { label: "A", text: "先去酒店放行李，稍作休息，然后在附近随便逛逛，适应环境" },
      { label: "B", text: "放下行李后立即出发，直奔最想去的景点，珍惜每一分钟" },
      { label: "C", text: "直接去景点，行李可以先寄存在车站，晚上再回酒店" }
    ]
  },
  {
    id: 2,
    title: "早餐选择",
    description: "第二天早上，关于早餐的讨论",
    options: [
      { label: "A", text: "找当地特色早餐店，坐下来慢慢吃，体验当地生活" },
      { label: "B", text: "在酒店吃早餐，方便快捷，节省时间" },
      { label: "C", text: "路边随便买点带走，边走边吃，赶往下一个景点" }
    ]
  },
  {
    id: 3,
    title: "行程规划方式",
    description: "讨论接下来几天的行程安排",
    options: [
      { label: "A", text: "制定详细计划，每天几点去哪、玩多久、吃什么都安排好" },
      { label: "B", text: "定个大方向，列出想去的地方，具体顺序和时间到时候再说" },
      { label: "C", text: "完全随性，走到哪算哪，根据当天心情决定" }
    ]
  },
  {
    id: 4,
    title: "发现一个小众景点",
    description: "在做攻略时发现一个当地人推荐的小众景点，但不顺路",
    options: [
      { label: "A", text: "调整行程，专门花时间去一趟，不想错过" },
      { label: "B", text: "如果时间充裕就去，时间紧张就放弃" },
      { label: "C", text: "不顺路就不去了，还是按原计划来" }
    ]
  },
  {
    id: 5,
    title: "午餐预算讨论",
    description: "关于午餐预算的讨论",
    options: [
      { label: "A", text: "出来玩就要吃好的，找当地有名的餐厅，预算不是问题" },
      { label: "B", text: "找当地特色但价格适中的餐馆，性价比最重要" },
      { label: "C", text: "随便吃点，省钱省时间，晚上再吃好的" }
    ]
  },
  {
    id: 6,
    title: "下午活动选择",
    description: "下午有点累了，如何安排接下来的时间",
    options: [
      { label: "A", text: "找个咖啡馆或公园休息，享受慢时光" },
      { label: "B", text: "继续参观，但选择轻松一点的室内景点" },
      { label: "C", text: "坚持按计划完成所有景点，累了可以稍微休息一下" }
    ]
  },
  {
    id: 7,
    title: "购物讨论",
    description: "旅行中关于购物的讨论",
    options: [
      { label: "A", text: "专门安排购物时间，买当地特产和纪念品" },
      { label: "B", text: "遇到喜欢的就买，不专门安排购物时间" },
      { label: "C", text: "几乎不购物，旅行是来看风景的不是来买东西的" }
    ]
  },
  {
    id: 8,
    title: "遇到下雨",
    description: "原定户外活动，但突然下起了大雨",
    options: [
      { label: "A", text: "立刻调整行程，改为室内活动，灵活应变" },
      { label: "B", text: "等一会儿看看雨会不会停，不行再改" },
      { label: "C", text: "坚持原计划，下雨有下雨的玩法，带伞继续" }
    ]
  },
  {
    id: 9,
    title: "晚上活动安排",
    description: "晚饭后的时间如何安排",
    options: [
      { label: "A", text: "回酒店休息，保存体力，明天早起" },
      { label: "B", text: "在附近散散步，看看夜景，然后回酒店" },
      { label: "C", text: "去体验当地夜生活，酒吧、夜市等，玩尽兴再回去" }
    ]
  },
  {
    id: 10,
    title: "旅行照处理",
    description: "关于旅行中拍照和发朋友圈的讨论",
    options: [
      { label: "A", text: "认真拍照、修图，每天发朋友圈记录" },
      { label: "B", text: "拍一些照片，但不会花太多时间修图，偶尔发朋友圈" },
      { label: "C", text: "很少拍照，主要用眼睛看，用心感受，几乎不发朋友圈" }
    ]
  }
];

// 旅行风格分析
const travelStyles = {
  planner: {
    name: "严谨规划型",
    desc: "喜欢制定详细计划，每一步都安排妥当，追求效率和确定性",
    icon: "📋"
  },
  explorer: {
    name: "随性探索型",
    desc: "享受旅途中的意外惊喜，喜欢随遇而安，不被计划束缚",
    icon: "🧭"
  },
  enjoyer: {
    name: "慢享生活型",
    desc: "注重旅行体验，不急于打卡，更在意感受当地文化和氛围",
    icon: "☕"
  },
  active: {
    name: "精力充沛型",
    desc: "行程安排得满满当当，珍惜每一分钟，希望看到更多风景",
    icon: "⚡"
  }
};

// 匹配分析
function calculateMatch(answers1, answers2) {
  let sameCount = 0;
  const similarCount = 0;
  
  for (let i = 0; i < answers1.length; i++) {
    if (answers1[i] === answers2[i]) {
      sameCount++;
    }
  }
  
  const matchScore = Math.round((sameCount / 10) * 100);
  
  return {
    score: matchScore,
    sameCount: sameCount,
    analysis: generateAnalysis(answers1, answers2, matchScore)
  };
}

function generateAnalysis(answers1, answers2, score) {
  const analysis = [];
  
  if (score >= 80) {
    analysis.push({
      title: "完美拍档！",
      text: "你们的旅行习惯高度契合，一起旅行一定会非常愉快！"
    });
  } else if (score >= 60) {
    analysis.push({
      title: "不错的伙伴",
      text: "你们有很多共同点，稍微沟通一下就能愉快地一起旅行。"
    });
  } else if (score >= 40) {
    analysis.push({
      title: "需要磨合",
      text: "你们的旅行习惯有些差异，出发前好好沟通很重要。"
    });
  } else {
    analysis.push({
      title: "风格差异较大",
      text: "你们的旅行方式很不一样，如果一起旅行需要更多包容和沟通。"
    });
  }
  
  // 具体分析
  const sameAnswers = [];
  const diffAnswers = [];
  
  for (let i = 0; i < answers1.length; i++) {
    if (answers1[i] === answers2[i]) {
      sameAnswers.push(questions[i].title);
    } else {
      diffAnswers.push(questions[i].title);
    }
  }
  
  if (sameAnswers.length > 0) {
    analysis.push({
      title: "你们的共同点",
      text: `在${sameAnswers.slice(0, 3).join('、')}等问题上，你们的看法一致。`
    });
  }
  
  if (diffAnswers.length > 0) {
    analysis.push({
      title: "需要注意的差异",
      text: `在${diffAnswers.slice(0, 3).join('、')}等问题上，你们可能有不同的偏好。`
    });
  }
  
  return analysis;
}

function getTravelStyle(answers) {
  const counts = { planner: 0, explorer: 0, enjoyer: 0, active: 0 };
  
  answers.forEach((answer, index) => {
    switch(index) {
      case 0: // 第一天下午
        if (answer === 'A') counts.enjoyer++;
        if (answer === 'B') counts.active++;
        if (answer === 'C') counts.active++;
        break;
      case 2: // 行程规划
        if (answer === 'A') counts.planner++;
        if (answer === 'B') counts.explorer++;
        if (answer === 'C') counts.explorer++;
        break;
      case 5: // 下午活动
        if (answer === 'A') counts.enjoyer++;
        if (answer === 'B') counts.planner++;
        if (answer === 'C') counts.active++;
        break;
      case 8: // 晚上活动
        if (answer === 'A') counts.enjoyer++;
        if (answer === 'C') counts.active++;
        break;
    }
  });
  
  const maxCount = Math.max(...Object.values(counts));
  const style = Object.keys(counts).find(key => counts[key] === maxCount);
  
  return travelStyles[style];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    questions,
    calculateMatch,
    getTravelStyle,
    travelStyles
  };
}