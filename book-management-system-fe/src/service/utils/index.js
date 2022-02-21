// 处理请求返回结果
// 成功：{data: xxx}
// 失败：{error: msg}
export const handleLearningRequest = (result) => {
  if (!result) return { error: 'unknown' }

  if (result.code === 200) {
    return { data: result.data }
  }
  return { error: result.message }
}
