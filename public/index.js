// var preloader = document.getElementById('loading')
// setTimeout(function myfunction(){
//     preloader.style.display='none'
// },3000)



const next =document.getElementById("next")
const prev =document.getElementById("prev")
const slider =document.getElementsByClassName("slider")

// onclick event on next,prev button

//next

next.addEventListener("click",(e)=>{
    console.log("next clicked")
    // console.log(slider[0].children[0].children)

    // right click  --> image left mai by 1

    // width 320 px shift

    const one=slider[0].children[0].children[0].outerHTML
    const two=slider[0].children[0].children[1].outerHTML
    const three=slider[0].children[0].children[2].outerHTML
    const four=slider[0].children[0].children[3].outerHTML

    let arr=[]
    arr.push(one,two,three,four)
    console.log(arr,arr[0])
    console.log(slider[0].children[0].children[0].outerHTML);

    for (let i=0;i<slider[0].children[0].children.length;i++){
        
        if(i==3){
            slider[0].children[0].children[i].outerHTML=arr[0]
        }
        else{
            slider[0].children[0].children[i].outerHTML=arr[i+1]
        }

        // 0,1,2,3 >
        // 1,2,3,0

        // 0,1,2,3 <
        // 3,0,1,2

    }

})

//prev

prev.addEventListener("click",(e)=>{
    console.log("prev clicked")
    // left click  --> image right mai by 1
    
    // 320 px shift

    const one=slider[0].children[0].children[0].outerHTML
    const two=slider[0].children[0].children[1].outerHTML
    const three=slider[0].children[0].children[2].outerHTML
    const four=slider[0].children[0].children[3].outerHTML

    let arr=[]
    arr.push(one,two,three,four)
    console.log(arr,arr[0])
    console.log(slider[0].children[0].children[0].outerHTML);

    for (let i=0;i<slider[0].children[0].children.length;i++){
        
        if(i==0){
            slider[0].children[0].children[i].outerHTML=arr[slider[0].children[0].children.length-1]
        }
        else{
            slider[0].children[0].children[i].outerHTML=arr[i-1]
        }

        // 0,1,2,3 >
        // 1,2,3,0

        // 0,1,2,3 <
        // 3,0,1,2

    }

})
