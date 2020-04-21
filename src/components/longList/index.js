import React, {useState, useEffect, useRef} from 'react'
import listData from './dataJson'
import './style.css'

function LongList(props) {
  const {estimatedItemSize = 50} = props;
  const [visibleList, setVisibleList] = useState([])
  const [startIndex, setStartIndex] = useState(-1)
  const [allList, setAllList] = useState(0)
  const containerRef = useRef('container')
  const visibleCountRef = useRef(0)
  const listDataRef = useRef([])
  const positionRef = useRef([])
  const ulRef = useRef('ul')
  const topRef = useRef(null)

  useEffect(() => {
    const screenHeight = containerRef.current.clientHeight
    const visibleCount = Math.ceil(screenHeight / estimatedItemSize)
    visibleCountRef.current = visibleCount
    setTimeout(() => {
      listDataRef.current = listData;
      setStartIndex(0)
      setAllList(listData)
    }, 500)
  }, [estimatedItemSize])

  useEffect(() => {
    const position = [];
    for(let i = 0; i < allList.length; i++) {
      position[i] = {
        index: i,
        height: estimatedItemSize,
        top: i * estimatedItemSize,
        bottom: (i + 1) * estimatedItemSize
      }
    }
    positionRef.current = position
  }, [allList, estimatedItemSize])

  useEffect(() => {
    const endIndex = Math.min(startIndex + visibleCountRef.current + visibleCountRef.current, listDataRef.current.length)
    setVisibleList(listData.slice(startIndex, endIndex))
  }, [startIndex])

  useEffect(() => {
    const nodes = ulRef.current.children
    const positions = positionRef.current;
    const list = Array.from(nodes);
    if(positions.length > 0) {
      for(let i = 0; i < list.length; i++) {
        const nodeItem = list[i];
        const rect = nodeItem.getBoundingClientRect()
        const index = nodeItem.className.split('_')[1] - 0;
        // console.log(index)
        const height = rect.height;
        const oldHeight = positions[index].height;
        const dValue = oldHeight - height;
        if(dValue) {
          // console.log(index, height, oldHeight)
          positions[index].height = height;
          positions[index].bottom = positions[index].bottom - dValue;
          for(let j = index + 1; j < positions.length; j++) {
            positions[j].top = positions[j - 1].bottom;
            positions[j].bottom = positions[j].bottom - dValue;
          }
        }
      }
      // contextHeightRef.current = (positions[positions.length - 1].bottom)
      // console.log('positions', positions)
      topRef.current.style.height = positions[positions.length - 1].bottom + 'px'
      setStartOffset('update')
    }
  })
  function setStartOffset(type) {
    const positions = positionRef.current;
    let offset = 0;
    if(startIndex > 0) {
      offset = positions[startIndex - 1].bottom;
    }
    ulRef.current.style.transform = `translate3d(0,${offset}px,0)`
  }

  // function getStartIndex(scrollTop) {
  //   const positions = positionRef.current;
  //   let index = 0
  //   for(let i = 0; i < positions.length; i++) {
  //     if(positions[i].bottom >= scrollTop) {
  //       index = positions[i].index;
  //       break;
  //     }
  //   }
  //   return index;
  // }

  function binarySearch(list, value) {
    let left = 0;
    let right = list.length;
    let index = -1
    while(left < right) {
      const mid = Math.floor((left + right) / 2);
      if(list[mid].bottom === value) {
        index = mid;
        break;
      } else if(list[mid].bottom > value) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return index === -1 ? left : index;
  }

  const handleScroll = (e) => {
    const scrollTop = containerRef.current.scrollTop;
    const positions = positionRef.current;
    const index = binarySearch(positions, scrollTop);
    const startIndex = index - visibleCountRef.current <= 0 ? 0 : index - visibleCountRef.current
    // console.log('index', index)
    setStartIndex(startIndex)
    setStartOffset('scroll')
    // ulRef.current.style.transform = `translate3d(0,${offset}px,0)`
  }

  return(
    <div className="infinite-container" ref={containerRef} onScroll={handleScroll}>
      <div ref={topRef} className="infinite-top"></div>
      <ul className="infinite-list" ref={ulRef}>
        {
          visibleList.length && visibleList.map(item => (
            <li 
            className={`infinite-list-item item_${item.id}`} 
            key={item.id}><span className="index">{item.id}</span>{item.value}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default LongList