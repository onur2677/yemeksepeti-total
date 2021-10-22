var lastScrollHeight = 0
var timer = null
var wait = 2000

function calculate() {
    var cancelMessage = 'İptal olan siparişlere değerlendirme yapılamamaktadır.'
    var list = document.querySelectorAll('.order-body')

    if (list.length) {
        var order = 0

        var orderCount = 0
        var cancelledOrder = 0
        var cancelledOrderCount = 0

        list.forEach(item => {
            const cancelledOrderDiv = item.querySelector('.panel-body>.warning')
            var amountInfo = item.querySelector('.amount-info>strong').textContent.split(' ')
            if (amountInfo.length === 2) {
                var parsedOrder = parseFloat(amountInfo[0].replace(',', '.'))
                if (cancelledOrderDiv && cancelledOrderDiv.textContent.trim() === cancelMessage) {
                    cancelledOrder += parsedOrder
                    cancelledOrderCount++
                } else {
                    order += parsedOrder
                    orderCount++
                }
            }
        })
        if (cancelledOrder) {
            cancelledOrder = cancelledOrder.toFixed(2)
        }
        order = order.toFixed(2)

        var resultView = `
            Sipariş Sayısı       : ${orderCount} \n 
            Ortalama Sipariş Tutarı      : ${(order / orderCount).toFixed(2)} ₺ \n
            Toplam                : ${order} ₺ \n
            ${cancelledOrder ?
                `İptal Edilen Sipariş Sayısı      : ${cancelledOrderCount} \n
            Toplam İptal Edilen Sipariş Tutarı     : ${cancelledOrder} ₺ \n
            ` :
                ''}
        `

        alert(resultView)
    }
}

function autoScroll() {
    var sh = document.documentElement.scrollHeight
    if (sh !== lastScrollHeight) {
        lastScrollHeight = sh
        document.documentElement.scrollTop = sh
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'background') && (msg.subject === 'request')) {
        clearTimeout(timer)
        autoScroll()
        timer = setTimeout(calculate, wait)
    }
})

window.onload = function () {
    autoScroll()
}