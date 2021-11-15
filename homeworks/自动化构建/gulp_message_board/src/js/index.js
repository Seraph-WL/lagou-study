// 获取元素
var $list = $(".cmts .list");
var $btn = $(".reply .btn");
var $user = $(".reply .user");
var $editor = $(".reply .editor");
// 获取后台数据
$.ajax({
    url: "http://localhost:3000/db",
    type: "GET",
    success: function (data) {
        // console.log(data)
        // 将得到的数据通过模板添加到页面中
        $list.html(template("tem", data));
        // 在这里可以正常获取所有添加的元素
        // 需要获取 删除按钮，添加点击事件，删除自己所在的 li 标签
        deleteData();
    }
});

// 添加一项新的数据到数据库中
// 添加点击事件
$btn.click(function () {
    var username = $user.val();
    var content = $editor.val();
    $.ajax({
        url: "http://localhost:3000/comments",
        type: "POST",
        dataType: "json",
        data: {
            username: username,
            content: content
        },
        success: function (data) {
            // console.log(data);
            // 只加载新数据
            // 制作一个模板需要的对象数据，将 data 作为数组中的项
            $list.append(template("tem", {
                "comments": [data]
            }));
            // 添加删除事件
            deleteData();
        }
    })
    // 清空输入
    $user.val("");
    $editor.val("");
})

// 定义 点击 按钮 删除的函数
function deleteData() {
    $(".cmts .list .delete").click(function () {
        // 要找到自己的祖先中的li 标签
        $li = $(this).parents("li");
        // 找到 li 标签记录的在数据库中的 id
        var index = $li.attr("uid");
        // 发送请求到数据库，删除对应的数据
        $.ajax({
            url: "http://localhost:3000/comments/" + index,
            type: "DELETE"
        })
        // 从 DOM结构中删除对应的 li
        $li.remove();
    })
}