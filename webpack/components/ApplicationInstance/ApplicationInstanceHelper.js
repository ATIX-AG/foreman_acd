
function calculateServiceUsage(hostServiceId, services) {
  const service = services.find(serv => serv['id'] == hostServiceId);
  if ('currentCount' in service) {
    service['currentCount'] += 1;
  } else {
    service['currentCount'] = 1;
  }

  return services;
}

export {
  calculateServiceUsage,
};
