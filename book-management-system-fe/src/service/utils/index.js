// 处理请求返回结果
// 成功：{data: xxx}
// 失败：{error: msg}
export const handleLearningRequest = (result) => {
  console.log(result)
  if (!result) return { error: 'unknown' }

  if (result.status === 200) {
    return { data: result.data }
  }
  return { error: result.message }
}

export const domain = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9090'
