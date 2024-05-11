function addStatusValues(defaultText) {
    const statuses = ['Applied', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Declined']

    const StatusSelect = document.getElementById("StatusSelect")
    const CurrentStatusOption = document.createElement('option')
    CurrentStatusOption.id = 'CurrentStatus'
    CurrentStatusOption.value = statuses.indexOf(defaultText)
    CurrentStatusOption.text = defaultText 

    StatusSelect.appendChild(CurrentStatusOption)

    statuses.forEach((s, i) => {
        if (s !== defaultText) {
            const option = document.createElement("option")
            option.value = i
            option.text = s
            StatusSelect.append(option)
        }
    })
}

function editClick(job) {

    const fields = ['JobID', 'Company', 'Role', 'DateApplied']

    document.getElementById('JobEditModalDiv').innerHTML = '';
    document.getElementById('StatusSelect').innerHTML = '';

    for (let i = 0; i < fields.length; i++) {
        const div = document.createElement('div')

        if (fields[i] === 'JobID') {
            div.className = 'd-none'
            div.id = 'JobIdEdit';
        } else {
            div.className = 'form-group d-flex'
            div.id = fields[i] + 'Edit';
        }

        const span = document.createElement('span')
        span.style = 'color: red;'
        span.textContent = '*'

        const label = document.createElement('label')
        label.htmlFor = fields[i]
        label.style = 'width: 50%'
        label.textContent = ' ' + fields[i]
        
        const input = document.createElement('input')
        input.name = fields[i]
        input.type = fields[i] === 'DateApplied' ? 'date' : 'text'
        input.className = 'form-control'
        input.style = 'width: 50%; color: black;'
        input.required = true
        input.value = fields[i] === 'DateApplied' ? getFormattedDate(job['DateApplied']) : job[fields[i]]

        if (fields[i] !== 'DateApplied')
            div.appendChild(span)
            input.required = false
        
        div.appendChild(label)
        div.appendChild(input)

        document.getElementById('JobEditModalDiv').appendChild(div)
    }

    addStatusValues(job['Status'])
}

function getFormattedDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

async function deleteJob(job) {
    try {
        const jobID = job.JobID 
        await fetch(`http://localhost:3000/tracking/delete/${jobID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        location.reload()
    } catch(e) {
        console.log(e)
    }
}