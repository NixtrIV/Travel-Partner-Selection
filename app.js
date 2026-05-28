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
    // 被邀请，直接跳转到答题页
    window.location.href = `quiz.html?quizId=${quizId}&invitee=true&inviterName=${encodeURIComponent(inviterName)}`;
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
  
  const quizData = JSON.parse(localStorage.getItem(`quiz_${state.quizId}`) || '{}');
  
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
  document.getElementById('scoreNumber').textContent = `${result.score}%`;
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
  
  document.getElementById('scoreNumber').textContent = style.icon;
  document.getElementById('scoreNumber').style.fontSize = '72px';
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
  const inviteUrl = `${window.location.origin}${window.location.pathname.replace('quiz.html', 'index.html')}?quizId=${state.quizId}&inviterName=${encodeURIComponent(state.inviterName || '好友')}`;
  copyToClipboard(inviteUrl);
  showToast('邀请链接已复制！发给你的旅伴吧');
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
      title: "🎉 完美拍档！",
      text: "你们的旅行习惯高度契合，一起旅行一定会非常愉快！"
    });
  } else if (score >= 60) {
    analysis.push({
      title: "👍 不错的伙伴",
      text: "你们有很多共同点，稍微沟通一下就能愉快地一起旅行。"
    });
  } else if (score >= 40) {
    analysis.push({
      title: "🤝 需要磨合",
      text: "你们的旅行习惯有些差异，出发前好好沟通很重要。"
    });
  } else {
    analysis.push({
      title: "💡 风格差异较大",
      text: "你们的旅行方式很不一样，如果一起旅行需要更多包容和沟通。"
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
    planner: { name: "严谨规划型", desc: "喜欢制定详细计划，每一步都安排妥当，追求效率和确定性", icon: "📋" },
    explorer: { name: "随性探索型", desc: "享受旅途中的意外惊喜，喜欢随遇而安，不被计划束缚", icon: "🧭" },
    enjoyer: { name: "慢享生活型", desc: "注重旅行体验，不急于打卡，更在意感受当地文化和氛围", icon: "☕" },
    active: { name: "精力充沛型", desc: "行程安排得满满当当，珍惜每一分钟，希望看到更多风景", icon: "⚡" }
  };
  
  return styles[style];
}