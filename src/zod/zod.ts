import i18next from 'i18next'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'
import { makeZodI18nMap } from 'zod-i18n-map'
import { z } from 'zod'
import { getLocale } from '@/locales/dictionary'

const viTranslation = {
  errors: {
    invalid_type: "Kiểu dữ liệu không hợp lệ. Mong đợi {{expected}}, nhận được {{received}}",
    invalid_type_received_undefined: "Bắt buộc",
    invalid_type_received_null: "Bắt buộc",
    invalid_literal: "Giá trị không hợp lệ, mong đợi {{expected}}",
    unrecognized_keys: "Khóa không được nhận dạng trong đối tượng: {{keys}}",
    invalid_union: "Đầu vào không hợp lệ",
    invalid_union_discriminator: "Giá trị phân biệt không hợp lệ. Mong đợi {{options}}",
    invalid_enum_value: "Giá trị enum không hợp lệ. Mong đợi {{options}}, nhận được '{{received}}'",
    invalid_arguments: "Đối số của hàm không hợp lệ",
    invalid_return_type: "Kiểu trả về của hàm không hợp lệ",
    invalid_date: "Ngày không hợp lệ",
    custom: "Đầu vào không hợp lệ",
    invalid_intersection_types: "Không thể hợp nhất kết quả giao nhau",
    not_multiple_of: "Số phải là bội số của {{multipleOf}}",
    not_finite: "Số phải là hữu hạn",
    invalid_string: {
      email: "Email không hợp lệ",
      url: "URL không hợp lệ",
      emoji: "Emoji không hợp lệ",
      uuid: "UUID không hợp lệ",
      cuid: "CUID không hợp lệ",
      cuid2: "CUID2 không hợp lệ",
      ulid: "ULID không hợp lệ",
      regex: "Không hợp lệ",
      datetime: "Datetime không hợp lệ",
      startsWith: "Đầu vào phải bắt đầu với \"{{startsWith}}\"",
      endsWith: "Đầu vào phải kết thúc bằng \"{{endsWith}}\"",
    },
    too_small: {
      array: {
        exact: "Mảng phải chứa chính xác {{minimum}} phần tử",
        inclusive: "Mảng phải chứa ít nhất {{minimum}} phần tử",
        not_inclusive: "Mảng phải chứa nhiều hơn {{minimum}} phần tử",
      },
      string: {
        exact: "Chuỗi phải chứa chính xác {{minimum}} ký tự",
        inclusive: "Chuỗi phải chứa ít nhất {{minimum}} ký tự",
        not_inclusive: "Chuỗi phải chứa nhiều hơn {{minimum}} ký tự",
      },
      number: {
        exact: "Số phải bằng {{minimum}}",
        inclusive: "Số phải lớn hơn hoặc bằng {{minimum}}",
        not_inclusive: "Số phải lớn hơn {{minimum}}",
      },
      set: {
        exact: "Đầu vào không hợp lệ",
        inclusive: "Đầu vào không hợp lệ",
        not_inclusive: "Đầu vào không hợp lệ",
      },
      date: {
        exact: "Ngày phải bằng {{minimum, datetime}}",
        inclusive: "Ngày phải lớn hơn hoặc bằng {{minimum, datetime}}",
        not_inclusive: "Ngày phải lớn hơn {{minimum, datetime}}",
      },
    },
    too_big: {
      array: {
        exact: "Mảng phải chứa chính xác {{maximum}} phần tử",
        inclusive: "Mảng phải chứa nhiều nhất {{maximum}} phần tử",
        not_inclusive: "Mảng phải chứa ít hơn {{maximum}} phần tử",
      },
      string: {
        exact: "Chuỗi phải chứa chính xác {{maximum}} ký tự",
        inclusive: "Chuỗi phải chứa nhiều nhất {{maximum}} ký tự",
        not_inclusive: "Chuỗi phải chứa ít hơn {{maximum}} ký tự",
      },
      number: {
        exact: "Số phải bằng {{maximum}}",
        inclusive: "Số phải nhỏ hơn hoặc bằng {{maximum}}",
        not_inclusive: "Số phải nhỏ hơn {{maximum}}",
      },
      set: {
        exact: "Đầu vào không hợp lệ",
        inclusive: "Đầu vào không hợp lệ",
        not_inclusive: "Đầu vào không hợp lệ",
      },
      date: {
        exact: "Ngày phải bằng {{maximum, datetime}}",
        inclusive: "Ngày phải nhỏ hơn hoặc bằng {{maximum, datetime}}",
        not_inclusive: "Ngày phải nhỏ hơn {{maximum, datetime}}",
      },
    },
  },
  validations: {
    email: "Email không hợp lệ",
    url: "URL không hợp lệ",
    uuid: "UUID không hợp lệ",
    cuid: "CUID không hợp lệ",
    regex: "Không hợp lệ",
    datetime: "Datetime không hợp lệ",
  },
  types: {
    function: "hàm",
    number: "số",
    string: "chuỗi",
    nan: "nan",
    integer: "số nguyên",
    float: "số thực",
    boolean: "boolean",
    date: "ngày",
    bigint: "bigint",
    undefined: "undefined",
    symbol: "symbol",
    null: "null",
    array: "mảng",
    object: "đối tượng",
    unknown: "không xác định",
    promise: "promise",
    void: "void",
    never: "never",
    map: "map",
    set: "set",
  },
}

const vi = i18next.createInstance()
vi.init({
  lng: 'vi',
  resources: {
    vi: { zod: viTranslation },
  },
})

const en = i18next.createInstance()
en.init({
  lng: 'en',
  resources: {
    en: { zod: enTranslation },
  },
})


const zodMap = {
  en: makeZodI18nMap({ t: en.t }),
  vi: makeZodI18nMap({ t: vi.t }),
}

// Set zod error map by user's locale.
// The error message should be translated based on user's locale.
z.setErrorMap((err, ctx) => zodMap[getLocale()](err, ctx))

export { z }
