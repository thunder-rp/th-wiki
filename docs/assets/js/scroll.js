"use strict";
// 10/31/2017
class SmoothScroll {
    constructor(options) {
        this.endThreshold = 0.05;
        this.requestId = null;
        this.maxDepth = 10;
        this.viewHeight = 0;
        this.halfViewHeight = 0;
        this.maxDistance = 0;
        this.scrollHeight = 0;
        this.endScroll = 0;
        this.currentScroll = 0;
        this.resizeRequest = 1;
        this.scrollRequest = 0;
        this.scrollItems = [];
        this.lastTime = -1;
        this.maxElapsedMS = 100;
        this.targetFPMS = 0.06;
        this._onResize = (event) => {
            this.resizeRequest++;
            if (!this.requestId) {
                this.lastTime = performance.now();
                this.requestId = requestAnimationFrame(this._update);
            }
        };
        this._onScroll = (event) => {
            this.scrollRequest++;
            if (!this.requestId) {
                this.lastTime = performance.now();
                this.requestId = requestAnimationFrame(this._update);
            }
        };
        this._update = (currentTime = performance.now()) => {
            if (!this.target) {
                this.requestId = null;
                return;
            }
            
            let elapsedMS = currentTime - this.lastTime;
            if (elapsedMS > this.maxElapsedMS) {
                elapsedMS = this.maxElapsedMS;
            }
            const deltaTime = elapsedMS * this.targetFPMS;
            const dt = 1 - Math.pow(1 - this.scrollEase, deltaTime);
            const resized = this.resizeRequest > 0;
            const scrollY = window.pageYOffset;
            if (resized) {
                const height = this.target.clientHeight;
                document.body.style.height = height + "px";
                this.scrollHeight = height;
                this.viewHeight = window.innerHeight;
                this.halfViewHeight = this.viewHeight / 2;
                this.maxDistance = this.viewHeight * 2;
                this.resizeRequest = 0;
            }
            this.endScroll = scrollY;
            // this.currentScroll += (scrollY - this.currentScroll) * this.scrollEase;
            this.currentScroll += (scrollY - this.currentScroll) * dt;
            if (Math.abs(scrollY - this.currentScroll) < this.endThreshold || resized) {
                this.currentScroll = scrollY;
                this.scrollRequest = 0;
            }
            // const scrollOrigin = scrollY + this.halfViewHeight;
            const scrollOrigin = this.currentScroll + this.halfViewHeight;
            this.target.style.transform = `translate3d(0px,-${this.currentScroll}px,0px)`;
            for (let i = 0; i < this.scrollItems.length; i++) {
                const item = this.scrollItems[i];
                const distance = scrollOrigin - item.top;
                const offsetRatio = distance / this.maxDistance;
                item.endOffset = Math.round(this.maxOffset * item.depthRatio * offsetRatio);
                if (Math.abs(item.endOffset - item.currentOffset < this.endThreshold)) {
                    item.currentOffset = item.endOffset;
                }
                else {
                    // item.currentOffset += (item.endOffset - item.currentOffset) * this.scrollEase;
                    item.currentOffset += (item.endOffset - item.currentOffset) * dt;
                }
                item.target.style.transform = `translate3d(0px,-${item.currentOffset}px,0px)`;
            }
            this.lastTime = currentTime;
            this.requestId = this.scrollRequest > 0 ? requestAnimationFrame(this._update) : null;
        };
        this.target = options.target;
        if (!this.target) {
            throw new Error('SmoothScroll: Target element not found');
        }
        this.scrollEase = options.scrollEase != null ? options.scrollEase : 0.1;
        
        this.maxOffset = options.maxOffset != null ? options.maxOffset : 500;
        this.addItems();
        window.addEventListener("resize", this._onResize);
        window.addEventListener("scroll", this._onScroll);
        this._update();
    }
    addItems() {
        this.scrollItems = [];
        const elements = document.querySelectorAll("*[data-depth]");
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const depth = +element.getAttribute("data-depth");
            const rect = element.getBoundingClientRect();
            const item = {
                target: element,
                depth: depth,
                top: rect.top + window.pageYOffset,
                depthRatio: depth / this.maxDepth,
                currentOffset: 0,
                endOffset: 0
            };
            this.scrollItems.push(item);
        }
        return this;
    }
}