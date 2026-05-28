// 全局状态
const state = {
  currentPage: '',
  currentIndex: 0,
  selectedAnswer: '',
  answers: [],
  quizId: '',
  userName: '',
  isInvitee: false,
  inviterName: '',
  inviterAnswers: null
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  
  if (path.includes('quiz.html')) {
    state.currentPage = 'quiz';
    initQuizPage();
  } else if (path.includes('result.html')) {
    state.currentPage = 'result';
    initResultPage();
  } else {
    state.currentPage = 'index';
    initIndexPage();
  }
});

// 初始化首页
function initIndexPage() {
  const startBtn = document.getElementById('startBtn');
  const userNameInput = document.getElementById('userName');
  
  // 检查URL参数，如果有quizId说明是被邀请的
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('quizId');
  const inviterName = urlParams.get('inviterName');
  
  if (quizId && inviterName) {
    // 被邀请，从URL获取邀请者的答案
    const inviterAnswersStr = urlParams.get('inviterAnswers') || '';
    const inviterAnswers = inviterAnswersStr ? inviterAnswersStr.split('') : [];
    
    // 保存邀请者信息到 localStorage
    const quizData = {
      inviterName: inviterName,
      inviterAnswers: inviterAnswers,
      inviteeAnswers: null,
      createTime: Date.now()
    };
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(quizData));
    
    // 修改页面提示
    document.querySelector('.subtitle').textContent = `${inviterName}邀请你一起测试旅行搭子匹配度！`;
    userNameInput.placeholder = '请输入你的昵称，开始测试';
    
    // 被邀请者点击开始，直接跳转到答题页
    startBtn.addEventListener('click', function() {
      const userName = userNameInput.value.trim();
      if (!userName) {
        showToast('请输入你的昵称');
        return;
      }
      window.location.href = `quiz.html?quizId=${quizId}&invitee=true&inviterName=${encodeURIComponent(inviterName)}`;
    });
    return;
  }
  
  startBtn.addEventListener('click', function() {
    const userName = userNameInput.value.trim();
    if (!userName) {
      showToast('请输入你的昵称');
      return;
    }
    
    state.userName = userName;
    state.quizId = generateQuizId();
    localStorage.setItem(`quiz_${state.quizId}`, JSON.stringify({
      inviterName: userName,
      inviterAnswers: null,
      inviteeAnswers: null,
      createTime: Date.now()
    }));
    
    window.location.href = `quiz.html?quizId=${state.quizId}`;
  });
}

// 初始化答题页
function initQuizPage() {
  const urlParams = new URLSearchParams(window.location.search);
  state.quizId = urlParams.get('quizId');
  state.isInvitee = urlParams.get('invitee') === 'true';
  state.inviterName = decodeURIComponent(urlParams.get('inviterName') || '');
  
  // 如果是被邀请者，更新标题
  if (state.isInvitee && state.inviterName) {
    document.getElementById('inviterTitle').textContent = `${state.inviterName}邀请你测试`;
  }
  
  renderQuestion();
  bindEvents();
}

// 绑定事件
function bindEvents() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shareBtn = document.getElementById('shareBtn');
  
  prevBtn.addEventListener('click', prevQuestion);
  nextBtn.addEventListener('click', nextQuestion);
  
  if (shareBtn) {
    shareBtn.addEventListener('click', copyInviteLink);
  }
}

// 渲染问题
function renderQuestion() {
  const question = questions[state.currentIndex];
  const optionsContainer = document.getElementById('optionsContainer');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  document.getElementById('questionTitle').textContent = question.title;
  document.getElementById('questionDesc').textContent = question.description;
  
  // 渲染选项
  optionsContainer.innerHTML = '';
  question.options.forEach(option => {
    const optionEl = document.createElement('div');
    optionEl.className = 'option-item';
    if (state.answers[state.currentIndex] === option.label) {
      optionEl.classList.add('selected');
    }
    optionEl.innerHTML = `<span class="option-label">${option.label}.</span>${option.text}`;
    optionEl.dataset.label = option.label;
    optionEl.addEventListener('click', () => selectOption(option.label));
    optionsContainer.appendChild(optionEl);
  });
  
  // 更新进度
  const progress = ((state.currentIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `第 ${state.currentIndex + 1} / ${questions.length} 题`;
  
  // 更新按钮状态
  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.textContent = state.currentIndex === questions.length - 1 ? '提交答案 ✓' : '下一题 →';
  nextBtn.disabled = !state.answers[state.currentIndex];
}

// 选择选项
function selectOption(label) {
  state.answers[state.currentIndex] = label;
  
  const options = document.querySelectorAll('.option-item');
  options.forEach(opt => {
    opt.classList.remove('selected');
    if (opt.dataset.label === label) {
      opt.classList.add('selected');
    }
  });
  
  document.getElementById('nextBtn').disabled = false;
}

// 上一题
function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
  }
}

// 下一题
function nextQuestion() {
  if (!state.answers[state.currentIndex]) {
    showToast('请选择一个选项');
    return;
  }
  
  if (state.currentIndex < questions.length - 1) {
    state.currentIndex++;
    renderQuestion();
  } else {
    submitAnswers();
  }
}

// 提交答案
function submitAnswers() {
  // 保存答案
  const quizData = JSON.parse(localStorage.getItem(`quiz_${state.quizId}`) || '{}');
  
  if (state.isInvitee) {
    quizData.inviteeAnswers = state.answers;
  } else {
    quizData.inviterAnswers = state.answers;
  }
  
  localStorage.setItem(`quiz_${state.quizId}`, JSON.stringify(quizData));
  
  // 跳转到结果页
  window.location.href = `result.html?quizId=${state.quizId}&isInvitee=${state.isInvitee}`;
}

// 初始化结果页
function initResultPage() {
  const urlParams = new URLSearchParams(window.location.search);
  state.quizId = urlParams.get('quizId');
  state.isInvitee = urlParams.get('isInvitee') === 'true';
  const viewMatch = urlParams.get('viewMatch') === 'true';
  
  // 如果是查看匹配结果的链接（包含双方答案）
  if (viewMatch) {
    const inviterName = decodeURIComponent(urlParams.get('inviterName') || '邀请者');
    const inviterAnswersStr = urlParams.get('inviterAnswers') || '';
    const inviteeAnswersStr = urlParams.get('inviteeAnswers') || '';
    
    const inviterAnswers = inviterAnswersStr ? inviterAnswersStr.split('') : [];
    const inviteeAnswers = inviteeAnswersStr ? inviteeAnswersStr.split('') : [];
    
    if (inviterAnswers.length === 10 && inviteeAnswers.length === 10) {
      const matchResult = calculateMatch(inviterAnswers, inviteeAnswers);
      const quizData = { inviterName: inviterName };
      renderMatchResult(matchResult, quizData);
      bindResultEvents();
      return;
    }
  }
  
  const quizData = JSON.parse(localStorage.getItem(`quiz_${state.quizId}`) || '{}');
  state.inviterName = quizData.inviterName || '';
  
  // 如果被邀请者打开的是结果页，跳转到首页
  if (state.isInvitee && !quizData.inviteeAnswers) {
    window.location.href = `index.html?quizId=${state.quizId}&inviterName=${encodeURIComponent(state.inviterName || '')}`;
    return;
  }
  
  if (state.isInvitee) {
    // 被邀请者，显示匹配结果
    if (quizData.inviterAnswers && quizData.inviteeAnswers) {
      const matchResult = calculateMatch(quizData.inviterAnswers, quizData.inviteeAnswers);
      renderMatchResult(matchResult, quizData);
    } else {
      renderSingleResult(quizData.inviteeAnswers, quizData.inviterName, false);
    }
  } else {
    // 邀请者，显示单人结果，并提供分享功能
    renderSingleResult(quizData.inviterAnswers, quizData.inviterName, true);
  }
  
  bindResultEvents();
}

// 渲染匹配结果
function renderMatchResult(result, quizData) {
  // 根据分数选择对应的场景图片
  let matchImg;
  if (result.score >= 80) {
    matchImg = 'imgs/match_80_捡到宝了.jpg';
  } else if (result.score >= 60) {
    matchImg = 'imgs/match_60_还能抢救.jpg';
  } else if (result.score >= 40) {
    matchImg = 'imgs/match_40_和平协议.jpg';
  } else {
    matchImg = 'imgs/match_20_分头行动.jpg';
  }
  
  document.getElementById('scoreNumber').innerHTML = `
    <div style="text-align: center;">
      <img src="${matchImg}" alt="匹配场景" style="width: 200px; height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 10px;">
      <div style="font-size: 48px; font-weight: bold; color: #6366f1;">${result.score}%</div>
    </div>
  `;
  document.getElementById('scoreNumber').style.fontSize = 'inherit';
  document.getElementById('resultTitle').textContent = '你们的匹配度';
  document.getElementById('resultDesc').textContent = `${quizData.inviterName} vs 你`;
  
  // 根据分数设置图标
  if (result.score >= 80) {
    document.getElementById('resultIcon').textContent = '🎉';
  } else if (result.score >= 60) {
    document.getElementById('resultIcon').textContent = '👍';
  } else if (result.score >= 40) {
    document.getElementById('resultIcon').textContent = '🤝';
  } else {
    document.getElementById('resultIcon').textContent = '💡';
  }
  
  // 渲染分析
  const analysisContent = document.getElementById('analysisContent');
  analysisContent.innerHTML = result.analysis.map(item => `
    <div class="analysis-item">
      <h4>${item.title}</h4>
      <p>${item.text}</p>
    </div>
  `).join('');
}

// 渲染单人结果
function renderSingleResult(answers, userName, canInvite) {
  const style = getTravelStyle(answers);
  
  // 用图片替换emoji
  document.getElementById('scoreNumber').innerHTML = `<img src="${style.icon}" alt="${style.name}" style="width: 180px; height: 180px; object-fit: contain; border-radius: 12px;">`;
  document.getElementById('scoreNumber').style.fontSize = 'inherit';
  document.getElementById('resultTitle').textContent = style.name;
  document.getElementById('resultDesc').textContent = `${userName}的旅行风格`;
  document.getElementById('resultIcon').textContent = '✈️';
  
  // 隐藏匹配分数的背景
  document.querySelector('.match-score').style.background = '#f8f9ff';
  document.querySelector('.score-number').style.color = '#333';
  
  // 渲染风格描述
  const resultCard = document.getElementById('resultCard');
  resultCard.innerHTML = `
    <h3 style="margin-bottom: 15px; color: #333;">旅行风格分析</h3>
    <p style="color: #666; line-height: 1.8;">${style.desc}</p>
  `;
  
  // 渲染分析
  const analysisContent = document.getElementById('analysisContent');
  analysisContent.innerHTML = `
    <div class="analysis-item">
      <h4>测试完成！</h4>
      <p>你已经完成了旅行搭子匹配测试。邀请你的旅伴也来测试，看看你们是不是最合适的旅行伙伴！</p>
    </div>
  `;
  
  // 显示邀请按钮
  if (canInvite) {
    document.getElementById('inviteeSection').style.display = 'block';
  }
  
  // 如果是被邀请者，显示分享匹配结果给邀请者的按钮
  if (state.isInvitee) {
    const inviteeSection = document.getElementById('inviteeSection');
    inviteeSection.style.display = 'block';
    inviteeSection.querySelector('p').textContent = '测试完成！把匹配结果发给邀请者吧';
    const inviteBtn = document.getElementById('inviteBtn');
    inviteBtn.textContent = '📤 把匹配结果发给邀请者';
    inviteBtn.onclick = function() {
      shareMatchResultWithInviter();
    };
  }
}

// 绑定结果页事件
function bindResultEvents() {
  const restartBtn = document.getElementById('restartBtn');
  const shareResultBtn = document.getElementById('shareResultBtn');
  const inviteBtn = document.getElementById('inviteBtn');
  
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
  
  if (shareResultBtn) {
    shareResultBtn.addEventListener('click', () => {
      const url = window.location.href;
      copyToClipboard(url);
      showToast('结果链接已复制！');
    });
  }
  
  if (inviteBtn) {
    inviteBtn.addEventListener('click', copyInviteLink);
  }
}

// 复制邀请链接
function copyInviteLink() {
  // 把邀请者的答案编码进链接，这样被邀请者不用共享localStorage也能计算匹配度
  const quizData = JSON.parse(localStorage.getItem(`quiz_${state.quizId}`) || '{}');
  const answersStr = quizData.inviterAnswers ? quizData.inviterAnswers.join('') : '';
  
  // 不管当前在哪个页面，都生成指向 index.html 的链接
  const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
  const inviteUrl = `${window.location.origin}${basePath}index.html?quizId=${state.quizId}&inviterName=${encodeURIComponent(state.inviterName || '好友')}&inviterAnswers=${answersStr}`;
  copyToClipboard(inviteUrl);
  showToast('邀请链接已复制！发给你的旅伴吧');
}

// 分享匹配结果给邀请者
function shareMatchResultWithInviter() {
  const quizData = JSON.parse(localStorage.getItem(`quiz_${state.quizId}`) || '{}');
  const inviterAnswersStr = quizData.inviterAnswers ? quizData.inviterAnswers.join('') : '';
  const inviteeAnswersStr = quizData.inviteeAnswers ? quizData.inviteeAnswers.join('') : '';
  
  const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
  const resultUrl = `${window.location.origin}${basePath}result.html?viewMatch=true&quizId=${state.quizId}&inviterName=${encodeURIComponent(quizData.inviterName || '')}&inviterAnswers=${inviterAnswersStr}&inviteeAnswers=${inviteeAnswersStr}`;
  
  copyToClipboard(resultUrl);
  showToast('匹配结果链接已复制！发给邀请者查看');
}

// 复制到剪贴板
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// 显示提示
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// 生成测试ID
function generateQuizId() {
  return 'quiz_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 计算匹配度
function calculateMatch(answers1, answers2) {
  let sameCount = 0;
  
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

// 生成分析
function generateAnalysis(answers1, answers2, score) {
  const analysis = [];
  
  if (score >= 80) {
    analysis.push({
      title: "🎉 捡到宝了！",
      text: "你们上辈子就是同一个妈生的旅行灵魂，赶紧买票出发吧！"
    });
  } else if (score >= 60) {
    analysis.push({
      title: "👍 还能抢救一下",
      text: "虽然偶尔会掐架，但大部分时间还是能愉快玩耍的。"
    });
  } else if (score >= 40) {
    analysis.push({
      title: "🤝 建议签个和平协议",
      text: "出发前先约法三章，谁先发火谁请吃饭。"
    });
  } else {
    analysis.push({
      title: "🚶 建议分头行动",
      text: "建议在酒店门口分手，各玩各的，晚上再汇合。"
    });
  }
  
  // 找出相同和不同的点
  const sameTitles = [];
  const diffTitles = [];
  
  for (let i = 0; i < answers1.length; i++) {
    if (answers1[i] === answers2[i]) {
      sameTitles.push(questions[i].title);
    } else {
      diffTitles.push(questions[i].title);
    }
  }
  
  if (sameTitles.length > 0) {
    analysis.push({
      title: "✓ 你们的共同点",
      text: `在「${sameTitles.slice(0, 2).join('」「')}」等问题上，你们的看法一致。`
    });
  }
  
  if (diffTitles.length > 0) {
    analysis.push({
      title: "⚠ 需要注意的差异",
      text: `在「${diffTitles.slice(0, 2).join('」「')}」等问题上，你们可能有不同的偏好。出发前记得好好沟通哦！`
    });
  }
  
  return analysis;
}

// 获取旅行风格
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
  
  const styles = {
    planner: { name: "攻略卷王", desc: "Excel比导游还专业，行程表精确到分钟，每一分钱都算得明明白白。跟你旅行，闭着眼跟走就行。", icon: "imgs/planner_折纸人.jpg" },
    explorer: { name: "街溜子行为艺术家", desc: "迷路是常态，惊喜是常态，主打一个「走到哪算哪」。地图？那是给俗人用的，你有直觉导航。", icon: "imgs/explorer_折纸人.jpg" },
    enjoyer: { name: "饭点守护者", desc: "什么景点都不如一顿好饭重要，到点必须吃饭，天塌下来也要先找个舒服的地方躺平。", icon: "imgs/enjoyer_折纸人.jpg" },
    active: { name: "人型永动机", desc: "一天刷5个景点还能再战通宵，朋友圈步数永远霸榜，摄影师都跟不上你的节奏。", icon: "imgs/active_折纸人.jpg" }
  };
  
  return styles[style];
}