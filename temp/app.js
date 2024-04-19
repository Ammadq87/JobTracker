
function submit() {

    let jobTitle = ''

    // Sample input: https://careers.veeva.com/job/15171949/software-engineer-java-toronto-ca/?lever-source=Linkedin
    let input = document.getElementById('input').value;
    input = input.substring(0, input.indexOf('?'))
    
    const filterOn = document.getElementById('applyFilterCheck').checked
    if (filterOn) {
        let filterInput = document.getElementById('filterInput')?.value.split(',')
        filterInput = filterInput.map((f) => {return f.trim()})
        jobTitle = parseLink(input, filterInput)
    } else {
        jobTitle = parseLink(input)
    }

    console.log(jobTitle)
    document.getElementById('jobTitle').textContent = jobTitle;
}

/**
 * Parse job link and retreive job title 
 * @param {string} link 
 * @param {string[]} filters optional 
 * @returns Job Title 
*/
function parseLink(link, filters = []) {
    const elements = link.split('/')

    if (filters.length === 0)
        return 'Error'

    for (let i = 0; i < elements.length; i++) {
        const e = elements[i].toLowerCase()
        if (e.includes('-')) {
            const arr = e.split('-')
            let jobTitle = ''

            for (let j = 0; j < arr.length; j++) {
                const a = arr[j].toLowerCase()
                
                for (let k = 0; k < filters.length; k++) {
                    const f = filters[k].toLowerCase()
                    if ((a === f || a.includes(f)) && !jobTitle.includes(a))
                        jobTitle += a + ' '
                }
                
            }

            // most likely the first hyphenated element is the jobTitle
            return jobTitle

        } else {
            filters.forEach((f, j) => {
                if (e.includes(f))
                    return e
            })
        }
    }
}