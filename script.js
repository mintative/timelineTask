const data = [{
    "from": "2023-05-30T05:56:28+00:00",
    "to": "2023-05-30T05:57:10+00:00",
}, {
    "from": "2023-05-30T06:01:01+00:00",
    "to": "2023-05-30T06:49:31+00:00",
}, {
    "from": "2023-05-30T07:04:21+00:00",
    "to": "2023-05-30T07:05:26+00:00",
}, {
    "from": "2023-05-30T07:27:42+00:00",
    "to": "2023-05-30T08:28:52+00:00",
}, {
    "from": "2023-05-30T08:29:43+00:00",
    "to": "2023-05-30T08:31:28+00:00",
}, {
    "from": "2023-05-30T10:19:15+00:00",
    "to": "2023-05-30T10:21:02+00:00",
}, {
    "from": "2023-05-30T16:50:26+00:00",
    "to": "2023-05-30T16:50:49+00:00",
}, {
    "from": "2023-05-30T17:03:12+00:00",
    "to": "2023-05-30T17:04:24+00:00",
}, {
    "from": "2023-05-30T17:05:11+00:00",
    "to": "2023-05-30T17:05:55+00:00",
}, {
    "from": "2023-05-30T19:29:46+00:00",
    "to": "2023-05-30T19:31:04+00:00",
}, {
    "from": "2023-05-30T20:42:28+00:00",
    "to": "2023-05-30T20:43:31+00:00",
}];


const date = new Date(data[0].from);

const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
});

document.querySelector("#date").textContent = formatter.format(date);
document.querySelector("#visits").textContent = `${data.length} visit${data.length>1 ? "s" : ""}` ;



const timeline = document.querySelector(".timeline");

const stack = [];

data.forEach((item,index)=>{
    const date = new Date(item.from);


    let difference;

    if (index === 0) {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        difference = date - startOfDay;
    } else {
        const previousDate = new Date(data[index - 1].to);
        difference = date - previousDate;
    }

    const gapPercentage = difference / (24*60*60*1000) * 100;

    

    
    if (difference <= 15 * 60 * 1000 && index !== 0) {

        const pointsIndex =
            stack.findLastIndex(item => item.type === "points");

        const gapIndex =
            stack.findLastIndex(item => item.type === "gap");

        stack[pointsIndex].points++;
        stack[gapIndex].points++;

    } else {

        stack.push({
            type: "gap",
            percentage: gapPercentage,
            points: 1
        });

        stack.push({
            type: "points",
            points: 1,
        });
    }
    if (index === data.length-1) {
        const endOfDay = new Date(item.to);
        endOfDay.setUTCHours(24, 0, 0, 0);


        const diff = endOfDay - new Date(item.to);
        
        stack.push({
            type: "gap",
            percentage: diff/ (24*60*60*1000) *100,
            points:0,
        })
    }
})

for (let i=0;i<stack.length;i++) {
    
    if (stack[i].type === "gap") {
        const pointsSize = stack[i].points>0 ? (stack[i].points-1) * 12 + 12 : 0;
        const gap = document.createElement("div");
        gap.classList.add("gap");
        const minGap = i === 0 ? 5 : 17;
        gap.style.width = `max(${minGap}px, calc(${stack[i].percentage}% - ${pointsSize}px))`;
        timeline.appendChild(gap);
    } else if (stack[i].type === "points") {
        
        const points = document.createElement("div");
        points.classList.add("points");
        timeline.appendChild(points);
        
        for (let j=0;j<stack[i].points; j++) {
            const point = document.createElement("div");
            point.classList.add("point");
            points.appendChild(point);
        }
    }
}


console.log(stack);