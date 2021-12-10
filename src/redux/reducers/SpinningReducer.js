export const SpinningReducer = (prevState={
    isSpinning:false
},action) => {
    const {type,data} = action
    
    switch (type) {
        case "change_spinning":
            const newState = {...prevState}
            newState.isSpinning = data
            return newState
        default:
            return prevState
    }
    
}