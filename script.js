document.addEventListener('DOMContentLoaded', function() {
    
    const boxes = [
        { link: 'page1.html', textTop: '001', textBottom: ' About the work...' },
        { link: 'https://f01-1309918226.file.myqcloud.com/633/2025/06/12/1111/1111.html?x-cos-traffic-limit=10485760', textTop: '002', textBottom: '3d model scenic' },
        { link: 'videopage.html', textTop: '003', textBottom: ' Video link' },
        { link: 'https://drive.google.com/file/d/12asnNQXuUFSS76uqq-vxx9xwkjmaIPGl/view?usp=sharing', textTop: '004', textBottom: 'Dissertation...' },
        { link: 'previous_works_page.html', textTop: '005', textBottom: ' Previous work' }
    ];

  
    
    document.querySelectorAll('.draggable-box').forEach((box, index) => {
       
const randomWidth = Math.floor(Math.random() * 150) + 150;
const randomHeight = Math.floor(Math.random() * 150) + 150;


const maxLeft = window.innerWidth - randomWidth;
const maxTop = window.innerHeight - randomHeight;
const randomLeft = Math.floor(Math.random() * maxLeft);
const randomTop = Math.floor(Math.random() * maxTop);


box.style.width = `${randomWidth}px`;
box.style.height = `${randomHeight}px`;
box.style.left = `${randomLeft}px`;
box.style.top = `${randomTop}px`;
box.style.setProperty('--x', `${randomLeft}px`);
box.style.setProperty('--y', `${randomTop}px`);

        // 添加调整大小的手柄
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        box.appendChild(handle);
        
        // 添加顶部文本区域
        const textAreaTop = document.createElement('textarea');
        textAreaTop.className = 'text-area text-area-top';
        textAreaTop.value = boxes[index].textTop;
        box.appendChild(textAreaTop);
        
        // 添加底部文本区域
        const textAreaBottom = document.createElement('textarea');
        textAreaBottom.className = 'text-area text-area-bottom';
        textAreaBottom.value = boxes[index].textBottom;
        box.appendChild(textAreaBottom);
        
        // 随机初始位置
        const left = Math.random() * (window.innerWidth - 200);
        const top = Math.random() * (window.innerHeight - 200);
        box.style.left = left + 'px';
        box.style.top = top + 'px';
        
        // 设置初始背景位置
        box.style.setProperty('--x', left + 'px');
        box.style.setProperty('--y', top + 'px');

        // 添加点击事件
        box.addEventListener('click', function(e) {
            // 如果点击的是文本区域或调整大小的手柄，不进行跳转
            if (!e.target.classList.contains('text-area') && !e.target.classList.contains('resize-handle')) {
                window.open(boxes[index].link, '_blank');
            }
        });

        // 添加鼠标按下事件来处理拖动
        let isDragging = false;
        let startX, startY;

        box.addEventListener('mousedown', function(e) {
            if (!e.target.classList.contains('resize-handle') && !e.target.classList.contains('text-area')) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    box.style.pointerEvents = 'none';
                }
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                setTimeout(() => {
                    box.style.pointerEvents = 'auto';
                    isDragging = false;
                }, 10);
            }
        });
    });

    // 设置拖动功能
    interact('.draggable-box')
        .draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            listeners: {
                move: dragMoveListener
            }
        })
        .resizable({
            edges: { right: true, bottom: true, left: true, top: true },
            listeners: {
                move: resizeMoveListener
            },
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 100 },
                    max: { width: 500, height: 500 }
                })
            ]
        });
});

function updateBackgroundPosition(element) {
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--x', rect.left + 'px');
    element.style.setProperty('--y', rect.top + 'px');
}

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // 更新背景位置
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--x', rect.left + 'px');
    target.style.setProperty('--y', rect.top + 'px');
}

function resizeMoveListener(event) {
    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0);
    let y = (parseFloat(target.getAttribute('data-y')) || 0);

    // 更新元素的宽度和高度
    target.style.width = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // 如果调整左边或上边，需要更新位置
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // 更新背景位置
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--x', rect.left + 'px');
    target.style.setProperty('--y', rect.top + 'px');
} 
