
document.addEventListener('DOMContentLoaded', () => {
  new Slider();
  new Chat();
  new ThemeManager();
  new PageEffects();
  new PortfolioSlider();
});
// 轮播图功能
class Slider {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.currentSlide = 0;
    this.autoPlayInterval = null;

    // 获取按钮元素
    this.prevBtn = document.querySelector('.slider-btn.prev');
    this.nextBtn = document.querySelector('.slider-btn.next');

    // 绑定事件处理函数的上下文
    this.prevSlide = this.prevSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.goToSlide = this.goToSlide.bind(this);

    // 添加事件监听器
    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevSlide();
        // 重置自动播放
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
      });

      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextSlide();
        // 重置自动播放
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
      });
    }

    // 创建导航点
    this.createDots();

    // 开始自动播放
    this.startAutoPlay();

    // 添加鼠标悬停暂停自动播放
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', () => {
      clearInterval(this.autoPlayInterval);
    });
    slider.addEventListener('mouseleave', () => {
      this.startAutoPlay();
    });
  }

  goToSlide(index) {
    // 移除当前幻灯片的活动状态
    this.slides[this.currentSlide].classList.remove('active');
    // 更新当前幻灯片索引
    this.currentSlide = index;
    // 添加新幻灯片的活动状态
    this.slides[this.currentSlide].classList.add('active');
    // 更新导航点
    this.updateDots();
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(next);
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prev);
  }

  createDots() {
    const dotsContainer = document.querySelector('.slider-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = ''; // 清空现有的点
    this.slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        // 重置自动播放
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
    this.dots = dotsContainer.querySelectorAll('.dot');
    this.updateDots();
  }

  updateDots() {
    if (!this.dots) return;
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }
}

// 更新AI聊天功能
class Chat {
  constructor() {
    this.messagesContainer = document.querySelector('.chat-messages');
    this.input = document.querySelector('.chat-input input');
    this.sendButton = document.querySelector('.chat-input button');

    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // API配置 - 直接使用完整的 API Key
    this.API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.API_KEY = '49d4784ecbbc646a8d5111270e46e4e8.J4BXMwegN1OVIauc';

    // 存储对话历史
    this.chatHistory = [];

    // 添加欢迎消息
    this.addMessage('AI', '你好！我是AI助手，有什么可以帮你的吗？');

    // 配置 marked 和 highlight.js
    marked.setOptions({
      highlight: function(code, language) {
        if (language && window.hljs) {
          try {
            return window.hljs.highlight(code, { language }).value;
          } catch (e) {
            return code;
          }
        }
        return code;
      },
      breaks: true
    });

    // 确保 highlight.js 已加载
    if (window.hljs) {
      window.hljs.configure({
        ignoreUnescapedHTML: true
      });
    }

    // 添加新的元素引用
    this.clearBtn = document.querySelector('.clear-btn');
    this.exampleBtn = document.querySelector('.example-btn');
    this.exampleDropdown = document.querySelector('.example-dropdown');
    this.voiceBtn = document.querySelector('.voice-btn');

    // 绑定新的事件处理
    this.clearBtn.addEventListener('click', () => this.clearChat());
    this.exampleBtn.addEventListener('click', () => this.toggleExamples());
    this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
    
    // 为示例问题添加点击事件
    document.querySelectorAll('.example-dropdown a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.input.value = link.textContent;
        this.exampleDropdown.classList.remove('show');
        this.sendMessage();
      });
    });

    // 点击外部关闭示例下拉框
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.example-btn') && !e.target.closest('.example-dropdown')) {
        this.exampleDropdown.classList.remove('show');
      }
    });
  }

  createMessageElement(sender, content, isAI = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    
    let formattedContent = content;
    if (isAI) {
      // 使用 marked 渲染 Markdown
      formattedContent = marked.parse(content);
    }

    messageDiv.innerHTML = `
      <div class="message-content">
        <span class="sender">${sender}</span>
        <div class="content">${formattedContent}</div>
      </div>
    `;

    // 为代码块添加复制按钮
    messageDiv.querySelectorAll('pre code').forEach(block => {
      const pre = block.parentElement;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
      copyButton.onclick = async () => {
        try {
          await navigator.clipboard.writeText(block.textContent);
          copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制';
          setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
          copyButton.innerHTML = '<i class="fas fa-times"></i> 复制失败';
          setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
          }, 2000);
        }
      };

      // 将原始的 pre 元素包装在 wrapper 中
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(copyButton);
    });

    return messageDiv;
  }

  async addMessage(sender, text, isTyping = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="sender">${sender}</span>
            <p>${isTyping ? '' : text}</p>
        </div>
    `;
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    // 如果需要打字机效果
    if (isTyping && sender === 'AI') {
      const textElement = messageDiv.querySelector('p');
      await this.typeWriter(textElement, text);
    }

    return messageDiv;
  }

  async typeWriter(element, text, speed = 50) {
    let i = 0;
    while (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (text) {
        // 显示用户消息
        await this.addMessage('User', text);
        this.input.value = '';

        try {
            // 直接调用 getAIResponse，它会处理消息的显示
            await this.getAIResponse(text);
        } catch (error) {
            // 显示错误消息
            await this.addMessage('AI', '抱歉，我现在无法回答。请稍后再试。');
            console.error('AI响应错误:', error);
        }
    }
  }

  async getAIResponse(text) {
    try {
        const requestData = {
            model: 'glm-4',
            messages: [
                { role: 'system', content: '你是一个有帮助的AI助手。' },
                ...this.chatHistory,
                { role: 'user', content: text },
            ],
            temperature: 0.7,
            stream: true  // 启用流式输出
        };

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.API_KEY}`,
            Accept: 'text/event-stream',  // 指定接受 SSE
        };

        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error?.message || data.msg || 'API请求失败');
        }

        // 创建一个新的消息元素
        const messageDiv = this.createMessageElement('AI', '', true);
        this.messagesContainer.appendChild(messageDiv);
        const contentElement = messageDiv.querySelector('.content');

        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const json = JSON.parse(data);
                        const content = json.choices[0]?.delta?.content || '';
                        if (content) {
                            fullContent += content;
                            console.log('PPPPTEST',fullContent);
                            
                            // 实时渲染 Markdown
                            contentElement.innerHTML = marked.parse(fullContent);
                            
                            // 为新的代码块添加复制按钮
                            contentElement.querySelectorAll('pre code').forEach(block => {
                                // 检查是否已经添加了复制按钮
                                const wrapper = block.closest('.code-wrapper');
                                if (!wrapper) {
                                    const pre = block.parentElement;
                                    const newWrapper = document.createElement('div');
                                    newWrapper.className = 'code-wrapper';
                                    
                                    const copyButton = document.createElement('button');
                                    copyButton.className = 'copy-button';
                                    copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
                                    copyButton.onclick = async () => {
                                        try {
                                            await navigator.clipboard.writeText(block.textContent);
                                            copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制';
                                            setTimeout(() => {
                                                copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
                                            }, 2000);
                                        } catch (err) {
                                            console.error('复制失败:', err);
                                            copyButton.innerHTML = '<i class="fas fa-times"></i> 复制失败';
                                            setTimeout(() => {
                                                copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
                                            }, 2000);
                                        }
                                    };

                                    // 将原始的 pre 元素包装在 wrapper 中
                                    pre.parentNode.insertBefore(newWrapper, pre);
                                    newWrapper.appendChild(pre);
                                    newWrapper.appendChild(copyButton);
                                }
                                
                                // 安全地调用代码高亮
                                if (window.hljs) {
                                    try {
                                        window.hljs.highlightElement(block);
                                    } catch (e) {
                                        console.warn('代码高亮失败:', e);
                                    }
                                }
                            });
                            
                            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                        }
                    } catch (e) {
                        console.error('解析响应数据失败:', e);
                    }
                }
            }
        }

        // 更新对话历史
        this.chatHistory.push(
            { role: 'user', content: text },
            { role: 'assistant', content: fullContent }
        );

        // 保持对话历史在合理长度
        if (this.chatHistory.length > 10) {
            this.chatHistory = this.chatHistory.slice(-10);
        }

        return fullContent;

    } catch (error) {
        console.error('完成错误:', error);
        throw error;
    }
  }

  // 生成 JWT token
  async generateToken() {
    try {
      // 创建 header
      const header = {
        alg: 'HS256',
        sign_type: 'SIGN',
      };

      // 创建 payload
      const now = Date.now();
      const payload = {
        api_key: this.API_ID,
        exp: now + 60000, // 1分钟后过期
        timestamp: now,
      };

      // 编码 header 和 payload
      const encodeBase64Url = (str) => {
        return btoa(JSON.stringify(str))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };

      const encodedHeader = encodeBase64Url(header);
      const encodedPayload = encodeBase64Url(payload);

      // 创建签名
      const signatureInput = `${encodedHeader}.${encodedPayload}`;
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.API_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(signatureInput)
      );

      // 将签名转换为 Base64URL
      const signatureArray = Array.from(new Uint8Array(signature));
      const encodedSignature = btoa(
        String.fromCharCode.apply(null, signatureArray)
      )
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      // 组合 JWT
      return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    } catch (error) {
      console.error('Token生成错误:', error);
      throw error;
    }
  }

  addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.innerHTML = `
            <div class="message-content">
                <span class="sender">${sender}</span>
                <p>${text}</p>
            </div>
        `;
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return messageDiv;
  }

  // 清空对话
  clearChat() {
    if (confirm('确定要清空所有对话记录吗？')) {
      this.messagesContainer.innerHTML = '';
      this.chatHistory = [];
      this.addMessage('AI', '对话已清空，有什么我可以帮你的吗？');
    }
  }

  // 切换示例问题下拉框
  toggleExamples() {
    this.exampleDropdown.classList.toggle('show');
  }

  // 语音输入功能
  async toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('抱歉，您的浏览器不支持语音输入功能');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    this.voiceBtn.classList.add('recording');
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      this.input.value = text;
      this.voiceBtn.classList.remove('recording');
    };

    recognition.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      this.voiceBtn.classList.remove('recording');
    };

    recognition.onend = () => {
      this.voiceBtn.classList.remove('recording');
    };

    recognition.start();
  }
}

// 在文件末尾添加新的功能类
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        
        // 初始化主题
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.setTheme(savedTheme);

        // 绑定事件
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => this.handleSystemThemeChange(e));

        // 添加滚动监听
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            const navLinks = document.querySelectorAll('.nav-link');
            
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                // 当滚动到顶部时，移除所有导航链接的高亮
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
            } else {
                navbar.classList.remove('scrolled');
                // 根据当前位置重新设置高亮
                this.updateActiveNavLink();
            }
        });

        // 初始化导航链接高亮
        this.updateActiveNavLink();

        // 添加平滑滚动
        this.initSmoothScroll();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // 添加过渡动画类
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // 添加按钮动画
        this.themeToggle.classList.add('theme-toggle-active');
        setTimeout(() => {
            this.themeToggle.classList.remove('theme-toggle-active');
        }, 300);
        
        this.setTheme(newTheme);
    }

    handleSystemThemeChange(e) {
        if (!localStorage.getItem('theme')) {
            this.setTheme(e.matches ? 'dark' : 'light');
        }
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // 获取导航栏高度
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    // 计算目标位置，考虑导航栏高度
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // 添加高亮效果
                    this.highlightNavLink(anchor);
                }
            });
        });
    }

    highlightNavLink(clickedLink) {
        // 移除所有导航链接的高亮
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        // 添加高亮到被点击的链接
        clickedLink.classList.add('active');
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // 获取当前滚动位置
        const scrollPosition = window.scrollY + 100; // 添加一些偏移量

        // 移除所有导航链接的高亮
        navLinks.forEach(link => link.classList.remove('active'));

        // 检查每个部分的位置
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
}

class PageEffects {
    constructor() {
        // 技能条动画
        this.initSkillBars();
        // 页面滚动动画
        this.initScrollAnimations();
        // 图片懒加载
        this.initLazyLoading();
    }

    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target.querySelector('.skill-level');
                    const percent = entry.target.dataset.percent;
                    bar.style.setProperty('--percent', `${percent}%`);
                    bar.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll('.portfolio-item, .contact-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}
class PortfolioSlider {
    constructor() {
        this.wrapper = document.querySelector('.portfolio-wrapper');
        this.currentIndex = 0;
        this.projects = portfolioConfig.projects;
        
        this.init();
        this.bindEvents();
         // 添加弹窗相关
         this.modal = document.querySelector('.portfolio-modal');
         this.modalTitle = this.modal.querySelector('.modal-header h3');
         this.modalDescription = this.modal.querySelector('.modal-description');
         this.modalDetails = this.modal.querySelector('.modal-details ul');
         this.modalTechStack = this.modal.querySelector('.tech-stack');
         
         // 绑定点击事件
         this.wrapper.addEventListener('click', (e) => {
             const portfolioItem = e.target.closest('.portfolio-item');
             if (portfolioItem) {
                 const index = Array.from(this.wrapper.children).indexOf(portfolioItem);
                 this.showModal(this.projects[index]);
             }
         });
         
         // 关闭弹窗
         this.modal.querySelector('.close-modal').addEventListener('click', () => {
             this.hideModal();
         });
         
         // 点击遮罩层关闭
         this.modal.addEventListener('click', (e) => {
             if (e.target === this.modal) {
                 this.hideModal();
             }
         });
    }
    showModal(project) {
      this.modalTitle.textContent = project.title;
      this.modalDescription.textContent = project.description;
      
      // 渲染详情列表
      if (project.details) {
          this.modalDetails.innerHTML = project.details
              .map(detail => `<li>${detail}</li>`)
              .join('');
      }
      
      // 渲染技术栈
      this.modalTechStack.innerHTML = project.techStack
          .map(tech => `<span>${tech}</span>`)
          .join('');
          
      this.modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // 防止背景滚动
  }
  
  hideModal() {
      this.modal.classList.remove('show');
      document.body.style.overflow = '';
  }

    init() {
        // 渲染项目
        this.renderProjects();
        // 创建导航点
        this.createDots();
        // 更新当前状态
        this.updateSlider();
    }

    renderProjects() {
        this.wrapper.innerHTML = this.projects.map(project => `
            <div class="portfolio-item">
                <img src="${project.image}" alt="${project.title}">
                <div class="portfolio-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="portfolio-links">
                        <a href="${project.demoUrl}" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> 演示
                        </a>
                        <a href="${project.githubUrl}" class="github-link">
                            <i class="fab fa-github"></i> 源码
                        </a>
                    </div>
                    <div class="tech-stack">
                        ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    createDots() {
        const dotsContainer = document.querySelector('.portfolio-dots');
        dotsContainer.innerHTML = this.projects.map((_, index) => `
            <span class="portfolio-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
        `).join('');

        // 添加点击事件
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('portfolio-dot')) {
                this.currentIndex = parseInt(e.target.dataset.index);
                this.updateSlider();
            }
        });
    }

    bindEvents() {
        // 绑定导航按钮事件
        document.querySelector('.portfolio-nav.prev').addEventListener('click', () => {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
            this.updateSlider();
        });

        document.querySelector('.portfolio-nav.next').addEventListener('click', () => {
            this.currentIndex = Math.min(this.projects.length - 1, this.currentIndex + 1);
            this.updateSlider();
        });

        // 添加触摸滑动支持
        let startX, moveX;
        this.wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.wrapper.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });

        this.wrapper.addEventListener('touchend', () => {
            if (startX - moveX > 50) { // 向左滑动
                this.currentIndex = Math.min(this.projects.length - 1, this.currentIndex + 1);
            } else if (moveX - startX > 50) { // 向右滑动
                this.currentIndex = Math.max(0, this.currentIndex - 1);
            }
            this.updateSlider();
        });
    }

    updateSlider() {
        // 更新滑块位置
        const itemWidth = this.wrapper.querySelector('.portfolio-item').offsetWidth;
        this.wrapper.style.transform = `translateX(-${this.currentIndex * itemWidth}px)`;

        // 更新导航点状态
        document.querySelectorAll('.portfolio-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // 更新导航按钮状态
        document.querySelector('.portfolio-nav.prev').style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        document.querySelector('.portfolio-nav.next').style.opacity = 
            this.currentIndex === this.projects.length - 1 ? '0.5' : '1';
    }
}
