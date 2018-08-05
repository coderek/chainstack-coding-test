module.exports =
  {
    'database': {
      'main': {
        'user': 'cs',
        'host': process.env.DB_URL || '0.0.0.0',
        'database': 'chainstack',
        'password': 'abc',
        'port': 5432,
      }
    },
  }