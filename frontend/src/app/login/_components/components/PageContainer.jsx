function PageContainer(props) {
  const { title, description, children } = props

  return (
    <div>
      <title>{title}</title>
      <meta name='description' content={description} />
      {children}
    </div>
  )
}

export default PageContainer
