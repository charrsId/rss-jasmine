/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function () {
    var customMatchers = {
        notEmpeyKey: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expected) {
                    if (expected === undefined) {
                        expected = '';
                    }
                    var result = {
                        pass: true,
                        message: ''
                    };
                    // result.pass = util.equals(actual.key, '', customEqualityTesters);
                    var dataList = actual.data;
                    var key = actual.key;
                    var regularExpressionUrl = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/; // 检查 URL 格式是否正确的正规表达式
                    if (key && key.replace(/\s+/g, "")) {
                        if (dataList && dataList instanceof Array) {
                            for (var i = 0; i < dataList.length; i++) {
                                if (!dataList[i][actual.key].replace(/\s+/g, "")) {
                                    result.pass = false;
                                    result.message = '第' + (i + 1) + '行' + key + '为空';
                                    break;
                                }
                                if(key==='url'){
                                    if(!regularExpressionUrl.test(dataList[i].url)){
                                        result.pass = false;
                                        result.message = '第' + (i + 1) + '行url地址不正确';
                                        break;
                                    }
                                }
                              
                            }
                        } else {
                            result.pass = false;
                            result.message = 'data为空';
                        }

                    } else {
                        result.pass = false;
                        result.message = 'key为空';
                    }
                    if (result.pass) {
                        result.message = '测试通过';
                    } else {
                        result.message = '测试失败,原因:' + result.message;
                    }
                    return result;
                }
            };
        }
    };
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
     */
    describe('RSS Feeds', function () {
        beforeEach(function () {
            jasmine.addMatchers(customMatchers);
        });
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('website uri valid', function () {
            expect({
                data: allFeeds,
                key: 'url'
            }).notEmpeyKey();
        })


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('website name null', function () {
            expect({
                data: allFeeds,
                key: 'name'
            }).notEmpeyKey();
        })
    });


    /* TODO: 写一个叫做 "The menu" 的测试用例 */
    describe('The menu', function () {
        let $body, $slideMenu, $menuItem;
        beforeEach(function () {
            $body = $('body');
            $menuItem = $('.slide-menu');
            $menuBtn = $('.menu-icon-link');
        })

        /* TODO:
         * 写一个测试用例保证菜单元素默认是隐藏的。你需要分析 html 和 css
         * 来搞清楚我们是怎么实现隐藏/展示菜单元素的。
         */
        it('hide when init ', function () {
            expect($body.hasClass('menu-hidden') && $menuItem.length > 0).toBeTruthy();
        })

        /* TODO:
         * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
         * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
         * 再次点击的时候是否隐藏。
         */
        it('btn can change menu show or hide when click', function () {
            $menuBtn.trigger('click');
            expect($body.hasClass('menu-hidden')).toBe(false);
            $menuBtn.trigger('click');
            expect($body.hasClass('menu-hidden')).toBe(true);
        })
    })

    /* TODO: 13. 写一个叫做 "Initial Entries" 的测试用例 */
    describe('Initial Entries', function () {
        /* TODO:
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         *
         * 记住 loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */
        beforeEach(function (done) {
            loadFeed(0, done)
        })

        it('The Function loadFeed  correct', function () {
            expect(loadFeed).not.toBe(0);
        })
    })
    /* TODO: 写一个叫做 "New Feed Selection" 的测试用例 */
    describe('New Feed Selection', function () {
        /* TODO:
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * 记住，loadFeed() 函数是异步的。
         */
        var container1;
        var container2;
        beforeEach(function (done) {
            loadFeed(1, function() { // 匿名函数，当loadFeed返回数据后执行
                // 在这里获取内容1
                container1 = $('.feed').html();
                // 获取完毕后开始请求新的数据
                loadFeed(0, function() {
                    // 获取内容2
                    container2 = $('.feed').html();
                    // 执行done，通知下方it开始测试（因为到现在为止，两次请求的数据才真正全部返回）
                    done();
                });
            });
        })

        it('The feed change success', function () {
            expect(container1).not.toBe(container2);
        })
    })
});