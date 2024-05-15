document.addEventListener('DOMContentLoaded', function() {
    notification = JSON.parse(document.querySelector('[data-notification]').getAttribute('data-notification'));

    const notificationsDiv = document.getElementById('notifications')
    const alert = document.createElement('div')
    alert.className = getClassName(notification.status)
    alert.role = 'alert'
    alert.innerText = notification.msg
    
    notificationsDiv.appendChild(alert)
    setTimeout(() => {
        notificationsDiv.innerHTML = ''
        goToParentUrl()
    }, 5000)
});

function getClassName(status = 0) {
    if (status === 200)
        return 'alert alert-success'
    if (status === 400)
        return 'alert alert-danger'
    return 'alert alert-info'
}

function goToParentUrl() {
    const currentUrl = window.location.href
    const segments = currentUrl.split('/')
    segments.pop()
    const parentUrl = segments.join('/')
    window.location.href = parentUrl
}