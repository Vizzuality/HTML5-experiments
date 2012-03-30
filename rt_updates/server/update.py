
"""
this script get latest updates from OSM and put the bounding box of changes into cartodb
"""

import time
import feedparser
from collections import deque
from cartodb import CartoDB, CartoDBException

import secret

user =  secret.user
password =  secret.password
CONSUMER_KEY = secret.CONSUMER_KEY
CONSUMER_SECRET= secret.CONSUMER_SECRET
cartodb_domain = user


OSM_CHANGES_RSS= 'http://www.openstreetmap.org/browse/changesets/feed';

# connect to cartodb

cl = CartoDB(CONSUMER_KEY, CONSUMER_SECRET, user, password, cartodb_domain)


etag = None
modified = None
ids = deque(maxlen=100)
while True:
    d = feedparser.parse(OSM_CHANGES_RSS, etag=etag, modified=modified)
    modified = modified
    etag = d.etag

    sql = []

    for e in d.entries:
        if e.id not in ids:
            ids.append(e.id)
            # u'45.2126441 -0.3701032 45.2126441 -0.3701032'
            if 'georss_box' in e:
                bbox = e['georss_box']
                latmin, lonmin, latmax, lonmax = bbox.split(' ')

                # compose polygon
                points = [
                    (lonmin, latmin),
                    (lonmin, latmax),
                    (lonmax, latmax),
                    (lonmax, latmin),
                    (lonmin, latmin)
                ]

                #insert into cartodb
                sql.append("insert into osm_updates (the_geom, osm_id) values(GeomFromText('MULTIPOLYGON(((%s)))',4326), '%s')" % (','.join([' '.join(x) for x in points]), e.id))

    # insert in bacth
    if sql:
        try:
            cl.sql(';'.join(sql))
        except CartoDBException as e:
            print ("some error ocurred inserting data into cartodb", e)

    time.sleep(2)
